import * as React from "react";
import {
  BaseBoxProps,
  BaseLocationBoxProps,
  BaseStateBoxContextValue,
  BaseStateBoxProps,
} from "./Box.types";
import { createContext } from "@ailiyah-ui/context";
import {
  styled,
  createElement,
  TailwindComponentDefaultProps,
  TailwindComponentProps,
} from "@ailiyah-ui/factory";
import {
  CornerLocationProps,
  LocationMap,
  TailwindProps,
} from "@ailiyah-ui/utils";

function getState(value: boolean): "active" | "inactive" {
  return value ? "active" : "inactive";
}

/*************************************************************************************************************************************
 * State Box
 *************************************************************************************************************************************
 */

/**
 * Function that creates a div container that has state information embedded in data-state attribute
 *
 * @param componentName name of component
 * @param defaultContext not required. Default value to be returned from useStateBoxContext.
 * @param defaultProps not required. Default props for created div element
 * @returns `[Root, useStateBoxContext]`. Root element and context hook.
 * @returns `Root` element: div element with tailwind styling props. If `defaultProps` are provided, set default
 * props values.
 * @returns `useStateBoxContext` hook: context hook for getting state information of the component. Returns
 * boolean variable `activeState`. `activeState = disabled && (initiallState || internalState)` where `initialState`
 * is set by parent and `internalState` is determined by hovering action.
 * @prop `disabled` - boolean variable - whether state information is disabled
 * @prop `initialState` - boolean variable - external state information to be inherited from parent element
 * @prop `hoverSetActive` - boolean variable - whether hovering set state to true
 * @prop `children` - either `React.ReactNode` or callback `(state: boolean):React.ReactNode=>{...}`
 */
function createStateBox<
  ContextValueType extends BaseStateBoxContextValue,
  StateBoxProps extends BaseStateBoxProps,
>(
  componentName: string,
  defaultContext?: ContextValueType,
  defaultProps?: Omit<StateBoxProps, "children">
) {
  const [StateBoxProvider, useStateBoxContext] =
    createContext<ContextValueType>(componentName, defaultContext);
  const Div = styled("div", defaultProps);

  const Root = React.memo(React.forwardRef<HTMLDivElement, StateBoxProps>((props, ref) => {
    const {
      initialState = true,
      hoverSetActive = true,
      disabled = false,
      children,
      onMouseEnter,
      onMouseLeave,
      ...rest
    } = props;
    const [internalState, setInternalState] = React.useState(false);
    const hoverOn = (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseEnter && onMouseEnter(e);
      if (hoverSetActive) {
        setInternalState(true);
      }
    };
    const hoverOff = (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseLeave && onMouseLeave(e);
      if (hoverSetActive) {
        setInternalState(false);
      }
    };
    const dataState = (initialState || internalState) && !disabled;
    return (
      <StateBoxProvider
        value={{ activeState: dataState } as unknown as ContextValueType}
      >
        <Div
          onMouseEnter={hoverOn}
          onMouseLeave={hoverOff}
          {...rest}
          ref={ref}
          data-state={getState(dataState)}
        >
          {typeof children === "function" ? children(dataState) : children}
        </Div>
      </StateBoxProvider>
    );
  }));
  return [Root, useStateBoxContext] as const;
}

function createStateBoxChildren<
  ElementType extends React.ElementType,
  ContextValueType extends BaseStateBoxContextValue = BaseStateBoxContextValue,
  PropsType extends
    TailwindComponentProps<ElementType> = TailwindComponentProps<ElementType>,
>(
  element: ElementType,
  componentName: string,
  stateHookFn: () => ContextValueType,
  defaultProps?: Omit<PropsType, "children">,
  propHookFn?: (props: any) => any,
  stateLabelFn?: (state: boolean) => string
) {
  type RefType = React.ElementRef<ElementType>;
  const Element = styled(
    element,
    defaultProps as TailwindComponentDefaultProps<ElementType>
  );
  const Component = React.memo(React.forwardRef<RefType, PropsType>((props, ref) => {
    const { activeState } = stateHookFn();
    const stateFn = stateLabelFn
      ? stateLabelFn
      : getState
    let rest = { ...props, "data-state": stateFn(activeState) };
    if (propHookFn) rest = propHookFn(rest);
    return <Element ref={ref} {...rest} />;
  }));
  Component.displayName = componentName;
  return Component;
}

function resolveLocation<T extends CornerLocationProps & TailwindProps>(
  props: T
) {
  let { compLocation = "top-right", twTopRightBottomLeft, ...rest } = props;
  twTopRightBottomLeft = twTopRightBottomLeft
    ? twTopRightBottomLeft
    : LocationMap[compLocation];
  return { ...rest, twTopRightBottomLeft: twTopRightBottomLeft };
}

/*************************************************************************************************************************************
 * Base Box
 *************************************************************************************************************************************
 */

/**
 * Function to create generic `div` with tailwind props
 *
 * @param componentName display name
 * @param defaultProps initial props
 * @returns Root div element that accepts tailwind props and with prop values intialised with defaultProps
 */
const createBox = (componentName: string, defaultProps?: BaseBoxProps) =>
  createElement("div", componentName, defaultProps);

/*************************************************************************************************************************************
 * Location Box
 *************************************************************************************************************************************
 */

/**
 * Similar to Box except it accepts the prop `compLocation` to represent its location
 * on the parent's container. `compLocation` takes on four corner values - i.e.
 * `top/bottom-left/right`.
 *
 * @param componentName display name of the component
 * @param defaultProps default props. Automatically set twPosition to absolute
 * @returns `Root` - box component
 */
function createLocationBox<BoxProps extends BaseLocationBoxProps>(
  componentName: string,
  defaultProps?: Omit<BoxProps, "children">
) {
  const Div = styled(
    "div",
    defaultProps
      ? { twPosition: "absolute", ...defaultProps }
      : { twPosition: "absolute" }
  );
  const Root = React.memo(React.forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
    let { children, ...rest } = resolveLocation(props);
    return (
      <Div {...rest} ref={ref}>
        {children}
      </Div>
    );
  }));
  Root.displayName = componentName;
  return Root;
}

/*************************************************************************************************************************************
 * Export
 *************************************************************************************************************************************
 */
export {
  createStateBox,
  createBox,
  createLocationBox,
  getState,
  createStateBoxChildren,
  resolveLocation,
};
