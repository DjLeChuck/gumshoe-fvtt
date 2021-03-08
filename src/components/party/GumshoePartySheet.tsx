/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useEffect, useState } from "react";
import * as constants from "../../constants";
import { GumshoeActor } from "../../module/GumshoeActor";
import { getDefaultThemeName, getNewPCPacks } from "../../settingsHelpers";
import { themes } from "../../theme";
import { AbilityType } from "../../types";
import { CSSReset } from "../CSSReset";
import { ActorSheetAppContext } from "../FoundryAppContext";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";

type GumshoePartySheetProps = {
  party: GumshoeActor,
  foundryApplication: ActorSheet,
};

type AbilityTuple = [AbilityType, string, string];
const typeHeaderKey = "typeHeader" as const;
const categoryHeaderKey = "categoryHeader" as const;
const abilityRowkey = "abilityRowString" as const;
type TypeHeader = {
  rowType: typeof typeHeaderKey,
  abilityType: AbilityType,
};
type CategoryHeader = {
  rowType: typeof categoryHeaderKey,
  category: string,
};
type AbilityRow = {
  rowType: typeof abilityRowkey,
  name: string,
  abilityType: AbilityType,
};
type RowData = TypeHeader | CategoryHeader | AbilityRow;
const isTypeHeader = (data: RowData): data is TypeHeader =>
  data.rowType === typeHeaderKey;
const isCategoryHeader = (data: RowData): data is CategoryHeader =>
  data.rowType === categoryHeaderKey;

const getSystemAbilities = async () => {
  const proms = getNewPCPacks().map(async (packId) => {
    const content = await game.packs
      .find((p: any) => p.collection === packId)
      .getContent();
    const pairs: AbilityTuple[] = content.map((i: any) => [
      i.data.type,
      i.data.data.category,
      i.data.name,
    ]);
    return pairs;
  });
  const results = await Promise.all(proms);
  return results.flat();
};

const compareTypes = (a: AbilityType, b: AbilityType) =>
  a === constants.investigativeAbility && b === constants.generalAbility
    ? -1
    : a === constants.generalAbility && b === constants.investigativeAbility
      ? +1
      : 0;

const compareStrings = (a: string, b: string) => {
  const a_ = a.toLowerCase();
  const b_ = b.toLowerCase();
  return a_ < b_ ? -1 : a_ > b_ ? +1 : 0;
};

const compareTuples = (
  [aType, aCategory, aName]: AbilityTuple,
  [bType, bCategory, bName]: AbilityTuple,
) => {
  const typeComparison = compareTypes(aType, bType);
  if (typeComparison !== 0) {
    return typeComparison;
  }
  const categoryComparison = compareStrings(aCategory, bCategory);
  if (categoryComparison !== 0) {
    return categoryComparison;
  }
  const nameComparison = compareStrings(aName, bName);
  return nameComparison;
};

const buildRowData = (tuples: AbilityTuple[]): RowData[] => {
  const result: RowData[] = [];

  const sorted = tuples.sort(compareTuples);

  let lastType: AbilityType | null = null;
  let lastCategory: string | null = null;

  for (const [abilityType, category, name] of sorted) {
    if (abilityType !== lastType) {
      result.push({ rowType: typeHeaderKey, abilityType });
      lastType = abilityType;
      lastCategory = null;
    }
    if (category !== lastCategory) {
      result.push({ rowType: categoryHeaderKey, category });
      lastCategory = category;
    }
    result.push({ rowType: abilityRowkey, name, abilityType });
  }
  return result;
};

export const GumshoePartySheet: React.FC<GumshoePartySheetProps> = ({
  foundryApplication,
  party,
}) => {
  const theme = themes[getDefaultThemeName()] || themes.trailTheme;
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [actors, setActors] = useState<GumshoeActor[]>([]);
  const actorIds = party.getActorIds();

  useEffect(() => {
    const getAbs = async () => {
      const tuples = await getSystemAbilities();
      const rowData = buildRowData(tuples);
      setRowData(rowData);

      const actors = actorIds.map((id) => game.actors.get(id) as GumshoeActor);
      setActors(actors);
    };
    getAbs();
  }, [actorIds]);

  return (
    <ActorSheetAppContext.Provider value={foundryApplication}>
      <CSSReset
        theme={theme}
        css={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <InputGrid>
          <GridField label="Party Name">
            <AsyncTextInput value={party.getName()} onChange={party.setName} />
          </GridField>
        </InputGrid>
        <div
          css={{
            flex: 1,
            display: "grid",
            gridTemplateRows: "auto",
            gridAutoRows: "auto",
            gridTemplateColumns: "max-content",
            gridAutoColumns: "minmax(min-content, 6em)",
            // gap: "0.5em",
            overflow: "auto",
            position: "relative",
          }}
        >
          <div
            css={{
              gridRow: 1,
              gridColumn: 1,
              position: "sticky",
              top: 0,
              background: theme.colors.thick,
            }}
          ></div>

          {actors.map((actor, j) => {
            return (
              <div
                key={actor.id}
                css={{
                  gridRow: 1,
                  gridColumn: j + 2,
                  position: "sticky",
                  top: 0,
                  background: theme.colors.thick,
                }}
              >
                {actor.name}
              </div>
            );
          })}

          {rowData.map((data, i) => {
            if (isTypeHeader(data)) {
              return (
                <h1 css={{ gridRow: i + 2 }}>
                  {data.abilityType === constants.generalAbility
                    ? "General"
                    : "Investigative"}
                </h1>
              );
            } else if (isCategoryHeader(data)) {
              return (
                <h2 css={{ gridRow: i + 2 }}>{data.category}</h2>
              );
            } else {
              return (
                <Fragment>
                  <div css={{ gridRow: i + 2 }}>
                    {data.name}
                  </div>
                  {actors.map((actor, j) => {
                    return (
                      <div
                        key={actor.id}
                        css={{
                          gridRow: i + 2,
                          gridColumn: j + 2,
                        }}
                      >
                        {actor
                          .getAbilityByName(
                            data.name,
                            data.abilityType,
                          )
                          ?.getRating() ?? "--"}
                      </div>
                    );
                  })}
                </Fragment>
              ); //
            }
          })}
        </div>
      </CSSReset>
    </ActorSheetAppContext.Provider>
  );
};
