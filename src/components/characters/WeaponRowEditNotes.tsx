/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useState } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { toHtml } from "../../textFunctions";
import { NoteFormat } from "../../types";
import { AsyncTextArea } from "../inputs/AsyncTextArea";
import { MarkdownEditor } from "../inputs/MarkdownEditor";
import { RichTextEditor } from "../inputs/RichTextEditor";

interface WeaponRowEditNotesProps {
  className?: string;
  item: InvestigatorItem;
}

export const WeaponRowEditNotes: React.FC<WeaponRowEditNotesProps> = ({
  className,
  item,
}: WeaponRowEditNotesProps) => {
  const note = item.getNotes();

  const onChange = useCallback(
    async (source: string) => {
      const format = item.getNotes().format;
      const html = toHtml(item.getNotes().format, source);
      await item.setNotes({
        format,
        html,
        source,
      });
    },
    [item],
  );

  // we do a little more work to avoid always rendering a TinyMCE for every
  // single item, which probably wouldn't scale very well.

  const [richtextEditMode, setRichtextEditMode] = useState(false);

  const onSaveRichtext = useCallback(
    async (source: string) => {
      await onChange(source);
      setRichtextEditMode(false);
    },
    [onChange],
  );

  const goEditMode = useCallback(() => {
    setRichtextEditMode(true);
  }, []);

  return (
    <div
      className={className}
      css={{
        gridColumn: "1 / -1",
        whiteSpace: "normal",
        margin: "0 0 0.5em 1em",
        position: "relative",
      }}
    >
      {note.format === NoteFormat.plain && (
        <AsyncTextArea onChange={onChange} value={note.source} />
      )}
      {note.format === NoteFormat.markdown && (
        <MarkdownEditor onChange={onChange} value={note.source} />
      )}
      {note.format === NoteFormat.richText &&
        (richtextEditMode
          ? (
            <div
            css={{
              height: "12em",
            }}
            onClick={goEditMode}
          >
            <RichTextEditor
              onSave={onSaveRichtext}
              initialValue={note.source}
            />
          </div>
            )
          : (
          <div
            css={{
              maxHeight: "8em",
              overflow: "auto",
            }}
            onClick={goEditMode}
          >
            <div dangerouslySetInnerHTML={{ __html: note.html }} />
          </div>
            ))}
    </div>
  );
};
