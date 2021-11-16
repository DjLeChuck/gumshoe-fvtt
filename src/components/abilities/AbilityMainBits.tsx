/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useEffect } from "react";
import { useUpdate } from "../../hooks/useUpdate";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { SpecialityList } from "./SpecialityList";
import { getCombatAbilities, getUseBoost } from "../../settingsHelpers";
import { Translate } from "../Translate";
import { assertAbilityDataSource, assertActiveCharacterDataSource, isActiveCharacterDataSource, ActiveCharacterDataSource } from "../../types";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { AsyncCheckbox } from "../inputs/AsyncCheckbox";
import { AsyncTextArea } from "../inputs/AsyncTextArea";

type AbilityEditorMainProps = {
  ability: InvestigatorItem,
};

export const AbilityMainBits: React.FC<AbilityEditorMainProps> = ({
  ability,
}) => {
  assertAbilityDataSource(ability.data);
  const updateRating = useCallback((rating) => {
    ability.setRating(rating);
  }, [ability]);
  const updatePool = useUpdate(ability, (pool) => ({ data: { pool } }));

  const onClickRefresh = useCallback(() => {
    ability.refreshPool();
  }, [ability]);

  const useBoost = getUseBoost();

  const isCombatAbility = getCombatAbilities().includes(ability.data.name);

  const [actorInitiativeAbility, setActorInitiativeAbility] = React.useState(
    isActiveCharacterDataSource(ability?.actor?.data) && ability?.actor?.data.data.initiativeAbility,
  );

  useEffect(() => {
    const callback = (actor: Actor, diff: {_id: string, data: DeepPartial<ActiveCharacterDataSource>}, options: unknown, id: string) => {
      if (actor.data._id === ability?.actor?.data?._id) {
        setActorInitiativeAbility(isActiveCharacterDataSource(ability?.actor?.data) && ability?.actor?.data.data.initiativeAbility);
      }
    };
    Hooks.on("updateActor", callback);
    return () => {
      Hooks.off("updateActor", callback);
    };
  }, [ability?.actor?.data]);

  const isAbilityUsed = actorInitiativeAbility === ability.name;
  const onClickUseForInitiative = useCallback(
    (e: React.MouseEvent) => {
      assertActiveCharacterDataSource(ability?.actor?.data);
      ability?.actor?.update({
        data: {
          initiativeAbility: ability.data.name,
        },
      });
    },
    [ability?.actor, ability.data.name],
  );
  const notes = useAsyncUpdate(ability.getNotes(), ability.setNotes);

  return (
    <InputGrid>
      <GridField label="Pool">
        <div
          css={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <AsyncNumberInput
            min={0}
            max={ability.data.data.rating}
            value={ability.data.data.pool}
            onChange={updatePool}
            css={{
              flex: 1,
            }}
          />
          <button
            css={{
              flexBasis: "min-content",
              flex: 0,
              lineHeight: "inherit",
            }}
            onClick={onClickRefresh}
          >
            <Translate>Refresh</Translate>
          </button>
        </div>
      </GridField>
      <GridField label="Rating">
        <AsyncNumberInput
          min={0}
          value={ability.data.data.rating}
          onChange={updateRating}
        />
      </GridField>
      {ability.getHasSpecialities() &&
        <GridFieldStacked label={ability.getSpecialities().length === 1 ? "Speciality" : "Specialities"}>
          <div
            css={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <SpecialityList ability={ability} />
          </div>
        </GridFieldStacked>
      }
      {useBoost &&
        <GridField label="Boost?">
          <AsyncCheckbox checked={ability.getBoost()} onChange={ability.setBoost}/>
        </GridField>
      }
      <GridFieldStacked label="Notes">
        <AsyncTextArea value={notes.display} onChange={notes.onChange} />
      </GridFieldStacked>

      {isCombatAbility &&
        <GridField label="Combat order">
          {isAbilityUsed
            ? (
            <i>
              <Translate>This ability is currently being used for combat ordering</Translate>
            </i>
              )
            : (
            <span>
              <a onClick={onClickUseForInitiative}>
                <Translate
                  values={{ AbilityName: ability?.name ?? "" }}
                >
                  Use (ability name) for combat ordering
                </Translate>
              </a>{" "}
              (
                {
                  actorInitiativeAbility
                    ? <Translate
                        values={{ AbilityName: actorInitiativeAbility }}
                      >
                        Currently using (ability name)
                      </Translate>
                    : <Translate>Currently using nothing</Translate>
                }
              )
            </span>
              )}
        </GridField>
      }
    </InputGrid>
  );
};
