import * as React from "react";
import { TailwindProps, PrimitiveProps } from "@ailiyah-ui/utils";
import { styled } from "@ailiyah-ui/factory";
import { Tooltip, TooltipProps } from "@ailiyah-ui/tooltip";
import {
  TrashIcon,
  Pencil1Icon,
  UploadIcon as _UploadIcon,
  DownloadIcon as _DownloadIcon,
  ThickArrowUpIcon,
  PlusIcon,
  DotsHorizontalIcon as _DotsHorizontalIcon,
  DotsVerticalIcon as _DotsVerticalIcon,
  Cross1Icon as _CrossIcon,
  CheckIcon as _CheckIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Popover from "@radix-ui/react-popover";
import "./Alert.css";
import "./Popover.css";
import "./Dialog.css";

type TailwindButtonProps = PrimitiveProps.ButtonProps & TailwindProps;

interface TooltipTailwindButtonProps
  extends TailwindButtonProps,
    Omit<TooltipProps, "children"> {}

interface DeleteAlertProps extends TooltipTailwindButtonProps {
  dialogTitle: string;
  dialogDescription: string;
  dialogCancelButtonName: string;
  dialogSubmitButtonName: string;
  dialogOnCancel: (event: React.MouseEvent<HTMLButtonElement>) => void;
  dialogOnSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const DeleteIcon = styled(TrashIcon);

const DeleteAlertButton = React.forwardRef<HTMLButtonElement, DeleteAlertProps>(
  (props, ref) => {
    const {
      tooltipContent = "Delete",
      dialogTitle,
      dialogDescription,
      dialogCancelButtonName = "Cancel",
      dialogSubmitButtonName = "OK",
      dialogOnCancel,
      dialogOnSubmit,
      ...rest
    } = props;

    return (
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <DeleteButton {...rest} ref={ref} tooltipContent={tooltipContent} />
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="DialogOverlay" />
          <AlertDialog.Content className="DialogContent bg-white rounded-[6px] w-[90vw] max-w-[450px] max-h-[85vh] p-[25px]">
            <AlertDialog.Title className="AlertDialogTitle">
              {dialogTitle}
            </AlertDialog.Title>
            <AlertDialog.Description className="AlertDialogDescription">
              {dialogDescription}
            </AlertDialog.Description>
            <div
              style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}
            >
              <AlertDialog.Cancel asChild>
                <button className="Button mauve" onClick={dialogOnCancel}>
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button className="Button red" onClick={dialogOnSubmit}>
                  Yes, Delete
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    );
  }
);

DeleteAlertButton.displayName = "DeleteAlertButton";

const createButton = (buttonName: string, icon: React.JSX.Element) => {
  const ButtonComponent = React.memo(
    React.forwardRef<HTMLButtonElement, TooltipTailwindButtonProps>(
      (props, ref) => {
        const { tooltipContent, ...rest } = props;
        const rendered = tooltipContent ? (
          <Tooltip tooltipContent={tooltipContent}>
            <styled.button ref={ref} {...rest}>
              {icon}
            </styled.button>
          </Tooltip>
        ) : (
          <styled.button ref={ref} {...rest}>
            {icon}
          </styled.button>
        );
        return rendered;
      }
    )
  );
  ButtonComponent.displayName = buttonName;
  return ButtonComponent;
};

const EditIcon = styled(Pencil1Icon);
const AddIcon = styled(PlusIcon);
const UploadIcon = styled(_UploadIcon);
const DownloadIcon = styled(_DownloadIcon);
const SubmitIcon = styled(ThickArrowUpIcon);
const DotsHorizontalIcon = styled(_DotsHorizontalIcon);
const DotsVerticalIcon = styled(_DotsVerticalIcon);

const EditButton = createButton("EditButton", <EditIcon themeName="Icons" />);
const AddButton = createButton("AddButton", <AddIcon themeName="Icons" />);
const UploadButton = createButton(
  "UploadButton",
  <UploadIcon themeName="Icons" />
);
const DownloadButton = createButton(
  "DownloadButton",
  <DownloadIcon themeName="Icons" />
);
const SubmitButton = createButton(
  "SubmitButton",
  <SubmitIcon themeName="Icons" />
);
const DeleteButton = createButton(
  "DeleteButton",
  <DeleteIcon themeName="Icons" />
);
const DotsHorizontalButton = createButton(
  "DotsHorizontalButton",
  <DotsHorizontalIcon themeName="Icons" />
);
const DotsVerticalButton = createButton(
  "DotsVerticalButton",
  <DotsVerticalIcon themeName="Icons" />
);

const LeftIcon = styled(DoubleArrowLeftIcon);
const LeftButton = createButton("LeftButton", <LeftIcon themeName="Icons" />);
const RightIcon = styled(DoubleArrowRightIcon);
const RightButton = createButton(
  "RightButton",
  <RightIcon themeName="Icons" />
);
const CrossIcon = styled(_CrossIcon);
const CrossButton = createButton(
  "CrossButton",
  <CrossIcon themeName="Icons" />
);
const CheckIcon = styled(_CheckIcon);
const CheckButton = createButton(
  "CheckButton",
  <CheckIcon themeName="Icons" />
);

interface PopOverButtonContentProps
  extends Omit<Popover.PopoverContentProps, "asChild">,
    TailwindProps {
  icon?: React.JSX.Element;
}

const PopOverButtonGroup = React.forwardRef<
  HTMLDivElement,
  PopOverButtonContentProps
>((props, ref) => {
  const { icon = <DotsHorizontalButton />, children, ...rest } = props;
  const Content = styled(Popover.Content);
  const Arrow = styled(Popover.Arrow);
  return (
    <Popover.Root>
      <Popover.Trigger asChild>{icon}</Popover.Trigger>
      <Popover.Portal>
        <Content
          className="PopoverContent"
          themeName="TooltipPopoverContent"
          sideOffset={5}
          hideWhenDetached={true}
        >
          <styled.div {...rest} ref={ref}>
            {children}
          </styled.div>
          <Arrow className="PopoverArrow" themeName="TooltipPopoverArrow" />
        </Content>
      </Popover.Portal>
    </Popover.Root>
  );
});

export {
  AddButton,
  DeleteButton,
  EditButton,
  UploadButton,
  DownloadButton,
  SubmitButton,
  DeleteAlertButton,
  DotsHorizontalButton,
  DotsVerticalButton,
  PopOverButtonGroup,
  AddIcon,
  DeleteIcon,
  EditIcon,
  UploadIcon,
  DownloadIcon,
  SubmitIcon,
  DotsHorizontalIcon,
  DotsVerticalIcon,
  LeftIcon,
  LeftButton,
  RightIcon,
  RightButton,
  CrossIcon,
  CrossButton,
  CheckIcon,
  CheckButton,
  createButton,
};

export type {
  TooltipTailwindButtonProps,
  PopOverButtonContentProps,
  TailwindButtonProps,
  DeleteAlertProps,
};
