import React from "react";
import { ControlRowProps } from "./interface";
import styles from "./styles.module.css";
import sharedStyles from "@/shared/styles.module.css";
import classNames from "classnames";
import { Button, Divider } from "@/components";
import { Grid } from "@/assets/icons";
import { DividerWithConditionProps } from "./types";

function DividerWithCondition({
  isWithout,
}: DividerWithConditionProps): React.ReactElement | null {
  if (isWithout) return null;

  return <Divider />;
}

function ControlRowInner(
  {
    className,
    title,
    info,
    buttonProps,
    iconProps,
    withoutTopDivider = false,
    withoutBottomDivider = false,
    ...other
  }: ControlRowProps,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.ReactElement {
  const {
    children: iconChildren = <Grid />,
    className: iconClassName,
    ...iconOther
  } = iconProps;

  const {
    children: buttonChildren = "Change",
    className: buttonClassName,
    variant: buttonVariant = "contained",
    ...buttonOther
  } = buttonProps;

  const rootStyles = classNames(styles.rootControlRow, className);
  const iconStyles = classNames(styles.avatar, iconClassName);
  const infoStyles = classNames(styles.info, sharedStyles.truncateText);
  const buttonStyles = classNames(styles.button, buttonClassName);

  return (
    <>
      <DividerWithCondition isWithout={withoutTopDivider} />
      <div ref={ref} className={rootStyles} {...other}>
        <div className={styles.descriptionWrap}>
          <div className={iconStyles} {...iconOther}>
            {iconChildren}
          </div>
          <div className={styles.descriptionText}>
            <span className={styles.title}>{title}</span>
            <span className={infoStyles}>{info}</span>
          </div>
        </div>
        <Button
          {...buttonOther}
          variant={buttonVariant}
          className={buttonStyles}
        >
          {buttonChildren}
        </Button>
      </div>
      <DividerWithCondition isWithout={withoutBottomDivider} />
    </>
  );
}

const ControlRow = React.forwardRef<HTMLDivElement, ControlRowProps>(
  ControlRowInner,
);

export default ControlRow;
