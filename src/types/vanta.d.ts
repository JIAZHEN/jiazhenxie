declare module "vanta/dist/vanta.clouds.min" {
  interface VantaCloudsConfig {
    el: HTMLElement;
    THREE: typeof THREE;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    skyColor?: number;
    cloudColor?: number;
    cloudShadowColor?: number;
    sunColor?: number;
    sunGlareColor?: number;
    sunlightColor?: number;
    speed?: number;
  }

  export interface VantaEffect {
    destroy: () => void;
  }

  function CLOUDS(config: VantaCloudsConfig): VantaEffect;
  export default CLOUDS;
}

declare module "vanta/dist/vanta.net.min" {
  interface VantaNetConfig {
    el: HTMLElement;
    THREE: typeof THREE;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: number;
    backgroundColor?: number;
    points?: number;
    maxDistance?: number;
    spacing?: number;
  }

  export interface VantaEffect {
    destroy: () => void;
  }

  function NET(config: VantaNetConfig): VantaEffect;
  export default NET;
}
