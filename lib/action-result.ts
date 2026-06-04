/** Server Action atsakymas — tik JSON serializuojami laukai */
export type ActionResult = {
  success: boolean;
  message: string;
};

export function actionSuccess(message: string): ActionResult {
  return { success: true, message };
}

export function actionError(message: string): ActionResult {
  return { success: false, message };
}

export function isActionResult(value: unknown): value is ActionResult {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    typeof (value as ActionResult).success === "boolean" &&
    "message" in value &&
    typeof (value as ActionResult).message === "string"
  );
}
