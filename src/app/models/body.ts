/** https://secure.dacadoo.com/confluence/display/SB/Body */
export class Body {
  /** https://dev-test.dacadoo.com/1/contents/resources/body */
  sex: "male" | "female";
  dateOfBirth: string;
  height: number;
  waist?: number;

  /** https://dev-test.dacadoo.com/1/contents/resources/weight */
  mass: number;
  fatMass: number;

  /** https://dev-test.dacadoo.com/1/contents/resources/heartrate */
  resting?: number;

  /** https://dev-test.dacadoo.com/1/contents/resources/bmi */
  bmi?: number;

  /** https://dev-test.dacadoo.com/1/contents/resources/bloodpressure */
  systolic: number;
  diastolic: number;

  /** https://dev-test.dacadoo.com/1/contents/resources/bloodwork */
  tsc?: number;
  hdl?: number;
  ldl?: number;
  tgl?: number;
  fbg?: number;
  cbg?: number;

  public Body() {
    this.sex = null;
    this.dateOfBirth = null;
    this.height = null;
    this.mass = null;
    this.fatMass = null;
    this.systolic = null;
    this.diastolic = null;
  }
}

export interface BodyMeasureSave {
  sex?: string;
  dateOfBirth?: string;
  height?: number;
  waist?: number;
  mass?: number;
  fatMass?: number;
}
