/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { equipment, weapon } from "../constants";
import { InvestigatorItem } from "../module/InvestigatorItem";
import { EquipmentSheet } from "./equipment/EquipmentSheet";
import { AbilitySheet } from "./abilities/AbilitySheet";
import { isAbility } from "../functions";
import { WeaponSheet } from "./equipment/WeaponSheet";
import { CSSReset, CSSResetMode } from "./CSSReset";
import { ItemSheetAppContext } from "./FoundryAppContext";

type InvestigatorItemSheetProps = {
  item: InvestigatorItem,
  foundryApplication: ItemSheet,
};

/**
 * We only register one "Item" sheet with foundry and then dispatch based on
 * type here.
 */
export const InvestigatorItemSheet: React.FC<InvestigatorItemSheetProps> = ({
  item,
  foundryApplication,
}) => {
  const theme = item.getTheme();

  return (
    <ItemSheetAppContext.Provider value={foundryApplication}>
      <CSSReset
        theme={theme}
        mode={CSSResetMode.small}
        css={{
          position: "relative",
        }}
      >
        <div css={{ position: "relative" }}>
          {isAbility(item)
            ? <AbilitySheet ability={item} application={foundryApplication} />
            : item.type === equipment
              ? <EquipmentSheet equipment={item} application={foundryApplication} />
              : item.type === weapon
                ? <WeaponSheet weapon={item} application={foundryApplication} />
                : <div>No sheet defined for item type &ldquo;{}&rdquo;</div>
          }
        </div>
      </CSSReset>
    </ItemSheetAppContext.Provider>
  );
};
