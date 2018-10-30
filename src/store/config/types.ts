export interface ConfigState {
  density: number; // const, how far pixels can be apart on scale == 1
  unit: number; // const, how many units of density form 1 measure on scale == 1
  scale: number; // varies, multiplier to the constants above

  gridOn: boolean;
  continuousLine: boolean;
  orthogonalMode: boolean;
  helpersOn: boolean;
}
