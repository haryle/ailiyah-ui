import * as React from "react";
import * as Button from "@ailiyah-ui/button";
import { Primitive as NavBar, NavBarProps } from "../primitive";
import { TailwindProps } from "@ailiyah-ui/utils";

const Root: React.FC<NavBarProps> = (props) => {
  const { children, themeName, ...rest } = props;
  let appliedTheme = themeName ? themeName : "NavBarRoot";
  return (
    <NavBar.Root {...rest} themeName={appliedTheme}>
      {children}
    </NavBar.Root>
  );
};

const Trigger: React.FC<TailwindProps> = (props) => {
  const { themeName, ...rest } = props;
  let appliedTheme = themeName ? themeName : "NavBarTrigger";
  const LeftButton = Button.createButton(
    "Collapse",
    <Button.LeftIcon themeName="NavBarIcons" />
  );
  const RightButton = Button.createButton(
    "Collapse",
    <Button.RightIcon themeName="NavBarIcons" />
  );
  return (
    <NavBar.Trigger {...rest} themeName={appliedTheme}>
      {(state, onClick) =>
        state ? (
          <LeftButton
            tooltipContent="Collapse"
            twTopRightBottomLeft="top-1/2"
            onClick={onClick}
          />
        ) : (
          <RightButton
            tooltipContent="Expand"
            twTopRightBottomLeft="top-1/2"
            onClick={onClick}
          />
        )
      }
    </NavBar.Trigger>
  );
};

const Content = React.forwardRef<HTMLDivElement, NavBarProps>((props, ref) => {
  const { children, themeName, ...rest } = props;
  let appliedThemeName = themeName ? themeName : "NavBarContent";
  return (
    <NavBar.Content ref={ref} {...rest} themeName={appliedThemeName}>
      {children}
    </NavBar.Content>
  );
});

const Body = React.forwardRef<HTMLDivElement, NavBarProps>((props, ref) => {
  const { children, themeName, ...rest } = props;
  let appliedThemeName = themeName ? themeName : "NavBarContentBody";
  return (
    <NavBar.Body ref={ref} {...rest} themeName={appliedThemeName}>
      {children}
    </NavBar.Body>
  );
});

const Header = React.forwardRef<HTMLDivElement, NavBarProps>((props, ref) => {
  const { children, themeName, ...rest } = props;
  let appliedThemeName = themeName ? themeName : "NavBarContentHeader";
  return (
    <NavBar.Header ref={ref} {...rest} themeName={appliedThemeName}>
      {children}
    </NavBar.Header>
  );
});

const Footer = React.forwardRef<HTMLDivElement, NavBarProps>((props, ref) => {
  const { children, themeName, ...rest } = props;
  let appliedThemeName = themeName ? themeName : "NavBarContentFooter";
  return (
    <NavBar.Footer ref={ref} {...rest} themeName={appliedThemeName}>
      {children}
    </NavBar.Footer>
  );
});

export { Root, Trigger, Content, Header, Body, Footer };
