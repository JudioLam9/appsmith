import * as React from "react";
import { useCallback, useState } from "react";
import { FORCE_RE_RENDER } from "@storybook/core-events";
import { useGlobals, addons } from "@storybook/manager-api";
import { AddonPanel, H6, Form } from "@storybook/components";
import { ColorControl, BooleanControl, NumberControl } from "@storybook/blocks";
import { fontMetrics } from "@design-system/theming";
import { debounce } from "lodash";
import styled from "styled-components";

interface PanelProps {
  active: boolean;
}

const StyledSelect = styled(Form.Select)`
  appearance: none;
  padding-right: 30px;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23696969%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat, repeat;
  background-position: right 0.8em top 50%, 0 0;
  background-size: 0.65em auto, 100%;
`;

const Wrapper = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ThemingPanel: React.FC<PanelProps> = (props) => {
  const [globals, updateGlobals] = useGlobals();
  const [isDarkMode, setDarkMode] = useState(false);

  const updateGlobal = (key, value) => {
    updateGlobals({
      [key]: value,
    }),
      // Invokes Storybook's addon API method (with the FORCE_RE_RENDER) event to trigger a UI refresh
      addons.getChannel().emit(FORCE_RE_RENDER);
  };

  const colorChange = (value) => updateGlobal("accentColor", value);
  const debouncedColorChange = useCallback(debounce(colorChange, 300), []);
  return (
    <AddonPanel {...props}>
      <Wrapper style={{ maxWidth: "250px" }}>
        <div>
          <H6>Dark mode</H6>
          <BooleanControl
            name="colorScheme"
            value={isDarkMode}
            onChange={(checked) => {
              setDarkMode(checked);
              updateGlobal("colorMode", checked ? "dark" : "light");
            }}
          />
        </div>

        <div>
          <H6>Border Radius</H6>
          <StyledSelect
            id="border-radius"
            title="Border Radius"
            size="100%"
            defaultValue={globals.borderRadius}
            onChange={(e) => updateGlobal("borderRadius", e.target.value)}
          >
            <option value="0px">Sharp</option>
            <option value="6px">Rounded</option>
            <option value="14px">Pill</option>
          </StyledSelect>
        </div>

        <div>
          <H6>Accent Color</H6>
          <ColorControl
            id="accent-color"
            name="accent-color"
            label="Accent Color"
            defaultValue={globals.accentColor}
            value={globals.accentColor}
            onChange={debouncedColorChange}
          />
        </div>

        <div>
          <H6>Font Family</H6>
          <StyledSelect
            id="font-family"
            size="100%"
            title="Font Family"
            defaultValue={globals.fontFamily}
            onChange={(e) => updateGlobal("fontFamily", e.target.value)}
          >
            <option value="">System Default</option>
            {Object.keys(fontMetrics)
              .filter((item) => {
                return (
                  ["-apple-system", "BlinkMacSystemFont", "Segoe UI"].includes(
                    item,
                  ) === false
                );
              })
              .map((font) => (
                <option value={font} key={`font-famiy-${font}`}>
                  {font}
                </option>
              ))}
          </StyledSelect>
        </div>

        <div>
          <H6>Root Unit Ratio</H6>
          <NumberControl
            name="root-unit-ratio"
            value={globals.rootUnitRatio ?? 1}
            min={0.8}
            max={1.2}
            step={0.01}
            onChange={(value) => updateGlobal("rootUnitRatio", value)}
          />
        </div>
      </Wrapper>
    </AddonPanel>
  );
};
