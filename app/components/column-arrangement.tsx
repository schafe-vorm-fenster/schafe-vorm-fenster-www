import React, { ReactElement } from "react";
import clsx from "clsx";

interface ColumnArrangementProps {
  children: [React.ReactNode, React.ReactNode];
  adjustment: "1:1" | "2:1" | "1:2" | "2:3" | "3:2";
  alignment?: "left" | "right";
}

export function ColumnArrangement(props: ColumnArrangementProps): ReactElement {
  const { children, adjustment, alignment = "left" } = props;
  const isRightAligned = alignment === "right";

  const columnClass = clsx({
    "grid-cols-2": adjustment === "1:1",
    "grid-cols-[2fr_1fr]":
      (adjustment === "2:1" && !isRightAligned) ||
      (adjustment === "1:2" && isRightAligned),
    "grid-cols-[1fr_2fr]":
      (adjustment === "1:2" && !isRightAligned) ||
      (adjustment === "2:1" && isRightAligned),
    "grid-cols-[2fr_3fr]":
      (adjustment === "2:3" && !isRightAligned) ||
      (adjustment === "3:2" && isRightAligned),
    "grid-cols-[3fr_2fr]":
      (adjustment === "3:2" && !isRightAligned) ||
      (adjustment === "2:3" && isRightAligned),
  });

  return (
    <div className={`grid ${columnClass} gap-4`}>
      {isRightAligned ? (
        <>
          <div>{children[1]}</div>
          <div>{children[0]}</div>
        </>
      ) : (
        <>
          <div>{children[0]}</div>
          <div>{children[1]}</div>
        </>
      )}
    </div>
  );
}

export default ColumnArrangement;
