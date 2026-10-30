// Orders a day's plans by time. A plan without a time stays right after the
// plan that came before it when it was added (imports add plans in the order
// they happen), so "Check in" doesn't sink below a 7:30 PM dinner.
export function sortPlansByTime<T extends { id: number; start_time: string | null }>(plans: T[]) {
  let lastTime = "00:00";
  const keyed = [...plans]
    .sort((a, b) => a.id - b.id)
    .map((plan) => {
      if (plan.start_time) lastTime = plan.start_time;
      return { plan, key: plan.start_time ?? lastTime };
    });
  // Array.sort is stable, so plans with the same key keep their added order.
  return keyed.sort((a, b) => a.key.localeCompare(b.key)).map((k) => k.plan);
}
