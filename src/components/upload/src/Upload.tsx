import * as React from "react";
import { styled } from "@ailiyah-ui/factory";
import { Tooltip } from "@ailiyah-ui/tooltip";
import { createContext } from "@ailiyah-ui/context";
import {
  UploadContextValue,
  UploadRootProps,
  UploadTriggerProps,
  CancelTriggerProps,
} from "./Upload.types";

const [UploadProvider, useUploadContext] = createContext<UploadContextValue>(
  "Upload",
  undefined
);

/**
 * Renders an <input type="file"> element that also provides context for its children.
 * For Upload children inside of Root, users can call `useUploadContext` hook to get
 * the `id` of the input element, and the two handlers `onFileUploaded` and `onFileRemoved`
 *
 * @param id - if you want the trigger label to be placed outside of Root
 * @param onFileUploaded - hook called when input value is changed
 * @param onFileRemoved - hook called to reset file input value
 * @param children - can be a React.ReactNode or a callback that renders a ReactNode based
 * on (id, onFileUploaded, onFileRemoved)
 *
 * Note: `onFileRemoved` returned in `useUploadContext` also clears the files property of
 * the input element. Equivalent to calling `document.getElementById(id).value=""`. Hence
 * when providing `onFileRemoved` hander, users don't need to manually clear to `files` property
 */
const Root = React.forwardRef<HTMLInputElement, UploadRootProps>(
  (props, ref) => {
    const { onFileUploaded, onFileRemoved, id, children, ...rest } = props;
    const inputId = id ? id : "file-upload" + React.useId();
    const internalRef = React.useRef(null);
    ref = internalRef;
    const uploadFile = onFileUploaded;
    const removeFile = (e: React.MouseEvent<HTMLButtonElement>) => {
      onFileRemoved && onFileRemoved(e);
      if (internalRef) {
        // @ts-ignore
        internalRef.current.value = "";
      }
    };
    const contextValue = React.useMemo(
      () => ({
        id: inputId,
        onFileUploaded: uploadFile,
        onFileRemoved: removeFile,
      }),
      [inputId, uploadFile, removeFile]
    );
    return (
      <UploadProvider value={contextValue as unknown as UploadContextValue}>
        <styled.input
          type="file"
          id={inputId}
          style={{ display: "none" }}
          ref={internalRef}
          {...rest}
          title="file-upload"
          className="file-upload"
          onChange={onFileUploaded}
        />
        {typeof children === "function"
          ? children(contextValue as unknown as UploadContextValue)
          : children}
      </UploadProvider>
    );
  }
);
Root.displayName = "Root";

/**
 * Renders an HTML `label` element with an internal `htmlFor` prop linked
 * to input<type="file"> that is rendered by Upload.Root. To specify
 * which input element that it refers to, either wrap it under an
 * `Upload.Root`, or provide an explicit `htmlFor` prop.
 *
 * @param htmlFor - id of input that this is linked to
 * @param tooltipContent - tooltip of the element that appears on hover
 *
 * Note: don't use a button as children of trigger
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label#accessibility_concerns
 *
 *
 * Example: using with implicit htmlFor
 *
 * ```
 * <Upload.Root><Upload.Trigger>Upload</Upload.Trigger></Upload.Root>
 * ```
 *
 * Using with explicit htmlFor
 * ```
 * <div>
 *  <input type="file" id="file-upload">
 *  <Upload.Trigger htmlFor="file-upload">Upload<Upload.Trigger>
 * </div>
 * ```
 */
const Trigger = React.forwardRef<HTMLLabelElement, UploadTriggerProps>(
  (props, ref) => {
    const {
      htmlFor,
      children,
      tooltipContent = "",
      twCursor = "hover:cursor-pointer",
      ...rest
    } = props;
    const { id } = useUploadContext();
    const _htmlFor = htmlFor ? htmlFor : id;

    return tooltipContent ? (
      <Tooltip tooltipContent={tooltipContent}>
        <styled.label
          htmlFor={_htmlFor}
          {...rest}
          ref={ref}
          twCursor={twCursor}
        >
          {children}
        </styled.label>
      </Tooltip>
    ) : (
      <styled.label htmlFor={_htmlFor} {...rest} ref={ref} twCursor={twCursor}>
        {children}
      </styled.label>
    );
  }
);
Trigger.displayName = "Trigger";

/**
 * Renders an HTML button element to remove image using `useUploadContext` hook.
 *
 * @param tooltipContent - tooltip of the element that appears on hover
 * @param onClick - button click handler - if provided, will be invoked before `onFileRemoved`
 * function from `useUploadContext` is invoked.
 */
const Cancel = React.forwardRef<HTMLButtonElement, CancelTriggerProps>(
  (props, ref) => {
    const { children, tooltipContent = "", onClick, ...rest } = props;
    const { onFileRemoved } = useUploadContext();
    const removeFile = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(e);
      }
      onFileRemoved && onFileRemoved(e);
    };

    return tooltipContent ? (
      <Tooltip tooltipContent={tooltipContent}>
        <styled.button {...rest} ref={ref} onClick={removeFile} type="button">
          {children}
        </styled.button>
      </Tooltip>
    ) : (
      <styled.button {...rest} ref={ref} onClick={removeFile} type="button">
        {children}
      </styled.button>
    );
  }
);

export { Root, Trigger, Cancel };
