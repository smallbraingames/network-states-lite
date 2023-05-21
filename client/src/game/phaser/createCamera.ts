// Adapted from https://github.com/latticexyz/mud/blob/main/packages/phaserx/src/createCamera.ts

import {
  BehaviorSubject,
  Subject,
  filter,
  map,
  sampleTime,
  scan,
  throttleTime,
} from "rxjs";
import { EventTypes, Gesture, UserHandlers } from "@use-gesture/vanilla";

type GestureState<T extends keyof UserHandlers<EventTypes>> = Parameters<
  UserHandlers<EventTypes>[T]
>[0];

const createCamera = (
  phaserCamera: Phaser.Cameras.Scene2D.Camera,
  minZoom: number,
  maxZoom: number,
  pinchSpeed: number,
  wheelSpeed: number
) => {
  // Stop default gesture events to not collide with use-gesture
  // https://github.com/pmndrs/use-gesture/blob/404e2b2ac145a45aff179c1faf5097b97414731c/documentation/pages/docs/gestures.mdx#about-the-pinch-gesture
  document.addEventListener("gesturestart", (e) => e.preventDefault());
  document.addEventListener("gesturechange", (e) => e.preventDefault());

  const worldView$ = new BehaviorSubject<
    Phaser.Cameras.Scene2D.Camera["worldView"]
  >(phaserCamera.worldView);
  const zoom$ = new BehaviorSubject<number>(phaserCamera.zoom);
  const wheelStream$ = new Subject<GestureState<"onWheel">>();
  const pinchStream$ = new Subject<GestureState<"onPinch">>();

  const gesture = new Gesture(
    phaserCamera.scene.game.canvas,
    {
      onPinch: (state) => pinchStream$.next(state),
      onWheel: (state) => wheelStream$.next(state),
    },
    {}
  );

  const onResize = () => {
    requestAnimationFrame(() => worldView$.next(phaserCamera.worldView));
  };
  phaserCamera.scene.scale.addListener("resize", onResize);

  function setZoom(zoom: number) {
    phaserCamera.setZoom(zoom);
    worldView$.next(phaserCamera.worldView);
    zoom$.next(zoom);
  }

  const pinchSub = pinchStream$
    .pipe(
      throttleTime(10),
      map((state) => {
        // Because this event stream is throttled, we're dropping events which contain delta data, so we need to calculate the delta ourselves.
        const zoom = zoom$.getValue();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const delta = state.offset[0] - zoom;
        const scaledDelta = delta * pinchSpeed;
        return zoom + scaledDelta;
      }), // Compute pinch speed
      map((zoom) => Math.min(Math.max(zoom, minZoom), maxZoom)), // Limit zoom values
      scan((acc, curr) => [acc[1], curr], [1, 1]) // keep track of the last value to offset the map position (not implemented yet)
    )
    .subscribe(([, zoom]) => {
      // Set the gesture zoom state to the current zoom value to avoid zooming beyond the max values
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (gesture._ctrl.state.pinch) gesture._ctrl.state.pinch.offset[0] = zoom;
      setZoom(zoom);
    });

  const wheelSub = wheelStream$
    .pipe(
      filter((state) => !state.pinching),
      sampleTime(10),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      map((state) => state.delta.map((x) => x * wheelSpeed)), // Compute wheel speed
      map((movement) => movement.map((m: number) => m / phaserCamera.zoom)), // Adjust for current zoom value
      map((movement) => [
        phaserCamera.scrollX + movement[0],
        phaserCamera.scrollY + movement[1],
      ]) // Compute new pinch
    )
    .subscribe(([x, y]) => {
      phaserCamera.setScroll(x, y);
      worldView$.next(phaserCamera.worldView);
    });

  function centerOn(x: number, y: number) {
    phaserCamera.centerOn(x, y);
    requestAnimationFrame(() => worldView$.next(phaserCamera.worldView));
  }

  function setScroll(x: number, y: number) {
    phaserCamera.setScroll(x, y);
    requestAnimationFrame(() => worldView$.next(phaserCamera.worldView));
  }

  return {
    phaserCamera,
    worldView$,
    zoom$,
    dispose: () => {
      pinchSub.unsubscribe();
      wheelSub.unsubscribe();
      gesture.destroy();
      phaserCamera.scene.scale.removeListener("resize", onResize);
    },
    centerOn,
    setScroll,
    setZoom,
  };
};

export default createCamera;
