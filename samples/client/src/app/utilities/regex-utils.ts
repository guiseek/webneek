export abstract class SeekRegexUtils {
  public static geoPosition: RegExp = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;

  public static isLocation(position: string) {
    return SeekRegexUtils.geoPosition.test(position);
  }
}
