import { screen } from "@testing-library/react";
import { expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { mockPrompt } from "./PromptElement.helper";

export const submitSpy = vi.fn((e) => {
  e.preventDefault();
});

const SetupAction = {
  upload: async () => {
    const file = new File(["hello"], "testImage.png", { type: "image/png" });
    await userEvent.upload(document.querySelector(".file-upload")!, file);
    await userEvent.unhover(document.querySelector(".file-upload")!);
  },
  reupload: async () => {
    const file = new File(["hello world"], "testImage.png", {
      type: "image/png",
    });
    await userEvent.upload(document.querySelector(".file-upload")!, file);
    await userEvent.unhover(document.querySelector(".file-upload")!);
  },
  type: async () => {
    await userEvent.type(
      document.querySelector(".PromptElementTextArea")!,
      mockPrompt
    );
    await userEvent.unhover(document.querySelector(".PromptElementTextArea")!);
  },
  hoverOnUpload: async () => {
    await userEvent.hover(screen.getByText("Upload"));
  },
  hoverOnThumbnail: async () => {
    await userEvent.hover(document.querySelector(".PromptElementThumbnail")!);
  },
  clickDelete: async () => {
    await userEvent.click(document.querySelector(".ThumbnailDeleteButton")!);
  },
  clickDeletePromptElement: async () => {
    await userEvent.click(
      document.querySelector(".PromptElementDeleteButton")!
    );
  },
  clickNewPrompt: async () => {
    await userEvent.click(
      document.querySelector(".PromptButtonGroupButton.Add")!
    );
  },
  clickSubmit: async () => {
    await userEvent.click(
      document.querySelector(".PromptButtonGroupButton.Submit")!
    );
  },
};

function createComponentTestSuite(selectorKey: string) {
  return {
    isInTheDocument: () => {
      expect(document.querySelector(selectorKey)).toBeInTheDocument();
    },
    isNotInTheDocument: () => {
      expect(document.querySelector(selectorKey)).not.toBeInTheDocument();
    },
    isVisible: () => {
      expect(document.querySelector(selectorKey)).toBeVisible();
    },
    isInvisible: () => {
      expect(document.querySelector(selectorKey)).not.toBeVisible();
    },
  };
}

function createIsATest(selectorKey: string, tagName: string) {
  return () => {
    expect(document.querySelector(selectorKey)!.tagName).toBe(tagName);
  };
}

function createTextContentTest(selectorKey: string, textContent: string) {
  return () => {
    expect(document.querySelector(selectorKey)!.textContent).toBe(textContent);
  };
}

const ComponentTest = {
  promptElementDeleteButton: createComponentTestSuite(
    ".PromptElementDeleteButton"
  ),
  promptElementTextArea: {
    ...createComponentTestSuite(".PromptElementTextArea"),
    isEnabled: createIsATest(".PromptElementTextArea", "TEXTAREA"),
    isDisabled: createIsATest(".PromptElementTextArea", "P"),
    hasNullContent: createTextContentTest(".PromptElementTextArea", ""),
    hasTypedContent: createTextContentTest(
      ".PromptElementTextArea",
      mockPrompt
    ),
  },
  thumbnailCanvas: {
    ...createComponentTestSuite(".ThumbnailCanvas"),
    isAnImage: createIsATest(".ThumbnailCanvas", "IMG"),
    isNotAnImage: createIsATest(".ThumbnailCanvas", "LABEL"),
  },
  thumbnailUploadButton: createComponentTestSuite(".ThumbnailUploadButton"),
  thumbnailDeleteButton: createComponentTestSuite(".ThumbnailDeleteButton"),
  promptFormAddButton: createComponentTestSuite(".PromptButtonGroupButton.Add"),
  promptFormSubmitButton: createComponentTestSuite(
    ".PromptButtonGroupButton.Submit"
  ),
};

const StateTest = {
  PromptForm: {
    rendered: () => {
      ComponentTest.promptFormAddButton.isInTheDocument();
      ComponentTest.promptFormAddButton.isVisible();
      ComponentTest.promptFormSubmitButton.isInTheDocument();
      ComponentTest.promptFormSubmitButton.isVisible();
    },
    notRendered: () => {
      ComponentTest.promptFormAddButton.isNotInTheDocument();
      ComponentTest.promptFormSubmitButton.isNotInTheDocument();
    },
    wasSubmitted: () => expect(submitSpy).toHaveBeenCalledOnce(),
    wasNotSubmitted: () => expect(submitSpy).toHaveBeenCalledTimes(0),
    havePromptCount: (count: number) => {
      return () =>
        expect(document.querySelectorAll(".PromptElementTextArea").length).toBe(
          count
        );
    },
    hasPromptElementTextAreaContent: (counter: number, textContent: string) => {
      return () =>
        expect(
          document.querySelectorAll(".PromptElementTextArea")[counter]
            .textContent
        ).toBe(textContent);
    },
    hasPromptElementThumbnailBeAnImage: (counter: number) => {
      return () =>
        expect(
          document.querySelectorAll(".ThumbnailCanvas")[counter].tagName
        ).toBe("IMG");
    },
    hasPromptElementThumbnailBeAnUploadForm: (counter: number) => {
      return () =>
        expect(
          document.querySelectorAll(".ThumbnailCanvas")[counter].tagName
        ).toBe("LABEL");
    },
  },
  PromptButtons: {
    rendered: () => {
      ComponentTest.promptElementDeleteButton.isInTheDocument();
    },
    unhovered: () => {
      ComponentTest.promptElementDeleteButton.isInvisible();
    },
    hovered: () => {
      ComponentTest.promptElementDeleteButton.isVisible();
    },
  },
  TextArea: {
    renderEnabled: () => {
      ComponentTest.promptElementTextArea.isInTheDocument();
      ComponentTest.promptElementTextArea.isVisible();
      ComponentTest.promptElementTextArea.isEnabled();
    },
    renderDisabled: () => {
      ComponentTest.promptElementTextArea.isInTheDocument();
      ComponentTest.promptElementTextArea.isVisible();
      ComponentTest.promptElementTextArea.isDisabled();
    },
    typed: ComponentTest.promptElementTextArea.hasTypedContent,
    empty: ComponentTest.promptElementTextArea.hasNullContent,
  },
  Thumbnail: {
    isAnImage: ComponentTest.thumbnailCanvas.isAnImage,
    isNotAnImage: ComponentTest.thumbnailCanvas.isNotAnImage,
    rendered: () => {
      ComponentTest.thumbnailCanvas.isInTheDocument();
      ComponentTest.thumbnailCanvas.isVisible();
    },
    unUploaded: () => {
      ComponentTest.thumbnailCanvas.isNotAnImage();
      ComponentTest.thumbnailUploadButton.isNotInTheDocument();
      ComponentTest.thumbnailDeleteButton.isNotInTheDocument();
    },
    uploaded: () => {
      ComponentTest.thumbnailCanvas.isAnImage();
      ComponentTest.thumbnailDeleteButton.isInTheDocument();
      ComponentTest.thumbnailUploadButton.isInTheDocument();
    },
    hovered: () => {
      ComponentTest.thumbnailUploadButton.isVisible();
      ComponentTest.thumbnailDeleteButton.isVisible();
    },
    unhovered: () => {
      ComponentTest.thumbnailUploadButton.isInvisible();
      ComponentTest.thumbnailDeleteButton.isInvisible();
    },
  },
};

export { SetupAction, StateTest, ComponentTest };
