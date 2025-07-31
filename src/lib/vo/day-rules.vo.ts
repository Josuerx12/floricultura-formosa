type DayRulesProps = {
  day: number;
  start: string;
  end: string;
  blocked?: boolean;
};

export class DayRule {
  day: number;
  start: string;
  end: string;
  blocked?: boolean;

  constructor(props: DayRulesProps) {
    this.validate(props);

    this.day = props.day;
    this.start = props.start;
    this.end = props.end;
    this.blocked = props.blocked;
  }

  private validate(props: DayRulesProps) {
    if (props.day < 0 || props.day > 6) {
      throw new Error("Day must be between 0 (Sunday) and 6 (Saturday)");
    }

    if (!props.start || !props.end) {
      throw new Error("Start and end times must be provided");
    }
  }
}
