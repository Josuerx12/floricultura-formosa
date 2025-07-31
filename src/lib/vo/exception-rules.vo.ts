type ExceptionRulesProps = { date: string; start: string; end: string };

export class ExceptionRules {
  date: string;
  start: string;
  end: string;

  constructor(props: ExceptionRulesProps) {
    this.validate(props);

    this.date = props.date;
    this.start = props.start;
    this.end = props.end;
  }

  validate(props: ExceptionRulesProps) {
    if (!props.date) {
      throw new Error("Date must be provided");
    }

    if (!props.start || !props.end) {
      throw new Error("Start and end times must be provided");
    }
  }
}
