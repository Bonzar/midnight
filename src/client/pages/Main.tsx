import React from "react";
import { Text } from "../components/ui/Text";
import { Indent } from "../components/ui/Indent/Indent";

export const Main = () => {
  return (
    <>
      <div>
        <div>
          <Text as="h1">Heading 1</Text>
          <Text as="h2">Heading 2</Text>
          <Text as="p">
            Paragraph text Paragraph text Paragraph text Paragraph text
            Paragraph text Paragraph text Paragraph text Paragraph text
            Paragraph text
          </Text>
          <Indent size={3} />
          <Text as="p">
            Paragraph text Paragraph text Paragraph text Paragraph text
            Paragraph text Paragraph text Paragraph text Paragraph text
            Paragraph text
          </Text>
          <Indent size={3} />
          <Text as="p">
            Paragraph text Paragraph text Paragraph text Paragraph text
            Paragraph text Paragraph text Paragraph text Paragraph text
            Paragraph text
          </Text>
        </div>
      </div>
    </>
  );
};
