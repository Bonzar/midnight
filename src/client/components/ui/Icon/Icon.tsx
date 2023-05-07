import React from "react";
import { useDynamicSvgImport } from "../../../hooks/useDinamicSvgImport";

type TIconFileNames = "saveDarkIcon";

type IIconProps = {
  iconName: TIconFileNames;
  wrapperClassname?: string;
} & React.SVGProps<SVGSVGElement>;

export function Icon({ iconName, wrapperClassname, ...other }: IIconProps) {
  const { loading, SvgIcon } = useDynamicSvgImport(iconName);

  return (
    <>
      {loading && null}
      {SvgIcon && (
        <div className={wrapperClassname}>
          <SvgIcon {...other} />
        </div>
      )}
    </>
  );
}
