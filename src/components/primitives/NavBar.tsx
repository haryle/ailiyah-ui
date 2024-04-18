import * as React from "react";
import { ITailwindTheme } from "../context/types";
import { styled, createElement } from "../context/factory";

type DivProps = React.ComponentPropsWithoutRef<"div"> & ITailwindTheme;
type DivRef = React.ElementRef<"div">;

/**
 * ------------------------------------------------------------------------------------------------
 * NavBar
 * ------------------------------------------------------------------------------------------------
 */

interface NavBarState {
  state: boolean;
  setState: Function;
}

const NavBarContext = React.createContext<NavBarState | undefined>(undefined);

const useNavBarContext = () => {
  const context = React.useContext(NavBarContext);
  if (!context) {
    throw new Error("useNavBarContext must be used within a Provider");
  }
  return context;
};

const NavBar = React.forwardRef<DivRef, DivProps>((props, ref) => {
  const { children, ...rest } = props;
  const [visible, setVisible] = React.useState(true);

  return (
    <NavBarContext.Provider value={{ state: visible, setState: setVisible }}>
      <styled.div ref={ref} {...rest}>
        {children}
      </styled.div>
    </NavBarContext.Provider>
  );
});

NavBar.displayName = "NavBar";

/**
 * ------------------------------------------------------------------------------------------------
 * NavBarTrigger
 * ------------------------------------------------------------------------------------------------
 */

interface NavBarTriggerProps extends Omit<DivProps, "children"> {
  children?: React.ReactNode | ((state: boolean) => React.ReactNode);
}

/**
 * Trigger to expand/collapse navigation bar
 */
const NavBarTrigger = React.forwardRef<DivRef, NavBarTriggerProps>(
  (props, ref = null) => {
    const { children, onClick = (e) => {}, ...rest } = props;
    const { state, setState } = useNavBarContext();
    const onClickHandler = (e) => {
      setState(!state);
      onClick(e);
    };
    return (
      <styled.div onClick={onClickHandler} {...rest} ref={ref}>
        {typeof children === "function" ? children(state) : children}
      </styled.div>
    );
  }
);
NavBarTrigger.displayName = "NavBarTrigger";

/**
 * ------------------------------------------------------------------------------------------------
 * NavBarContent
 * ------------------------------------------------------------------------------------------------
 */
const NavBarContent = React.forwardRef<DivRef, DivProps>(
  (props, ref = null) => {
    const { children, ...rest } = props;
    const { state } = useNavBarContext();
    return state ? (
      <styled.div ref={ref} {...rest}>
        {children}
      </styled.div>
    ) : (
      <styled.div ref={ref} {...rest} style={{ width: "0px" }}>
        {children}
      </styled.div>
    );
  }
);
NavBarContent.displayName = "NavBarContent";

/**
 * ------------------------------------------------------------------------------------------------
 * NavBarHeader
 * ------------------------------------------------------------------------------------------------
 */
const NavBarHeader = createElement("div", "NavBarContent");

/**
 * ------------------------------------------------------------------------------------------------
 * NavBarFooter
 * ------------------------------------------------------------------------------------------------
 */
const NavBarFooter = createElement("div", "NavBarContent");

/**
 * ------------------------------------------------------------------------------------------------
 * NavBarBody
 * ------------------------------------------------------------------------------------------------
 */
const NavBarBody = createElement("div", "NavBarContent");

/**
 * ------------------------------------------------------------------------------------------------
 * Export
 * ------------------------------------------------------------------------------------------------
 */
const Root = NavBar;
const Trigger = NavBarTrigger;
const Content = NavBarContent;
const Header = NavBarHeader;
const Footer = NavBarFooter;
const Body = NavBarBody;

export {
  NavBar,
  NavBarTrigger,
  NavBarContent,
  NavBarHeader,
  NavBarFooter,
  NavBarBody,
  //
  Root,
  Trigger,
  Content,
  Header,
  Body,
  Footer,
};
