import {
  agHelper,
  draggableWidgets,
  deployMode,
  entityExplorer,
  locators,
  propPane,
  widgetLocators,
} from "../../../../../support/Objects/ObjectsCore";

describe("Image widget tests", function () {
  const image = (src: string) => 'img[src="' + src + '"]';
  const jpgImg = "https://jpeg.org/images/jpegsystems-home.jpg";
  const gifImg =
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/5eeea355389655.59822ff824b72.gif";
  const svgImg = "https://assets.codepen.io/3/kiwi.svg";
  const webpImg = "https://www.gstatic.com/webp/gallery/4.sm.webp";
  const pngImg = "https://assets.appsmith.com/widgets/default.png";

  before(() => {
    entityExplorer.DragNDropWidget(draggableWidgets.IMAGE);
  });

  it("1. Verify Image Preview for different types of images (png, jpg, gif, svg, webp)", function () {
    //jpg
    propPane.TypeTextIntoField("Image", jpgImg);
    agHelper.AssertAttribute(widgetLocators.image + " img", "src", jpgImg);
    deployMode.DeployApp(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper.AssertElementExist(image(jpgImg));
    agHelper.AssertContains("Unable to display the image", "not.exist");
    deployMode.NavigateBacktoEditor();
    entityExplorer.SelectEntityByName("Image1", "Widgets");
    //gif
    propPane.TypeTextIntoField("Image", gifImg);
    agHelper.AssertAttribute(widgetLocators.image + " img", "src", gifImg);
    deployMode.DeployApp(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper.AssertElementExist(image(gifImg));
    agHelper.AssertContains("Unable to display the image", "not.exist");
    deployMode.NavigateBacktoEditor();
    entityExplorer.SelectEntityByName("Image1", "Widgets");
    //webp
    propPane.TypeTextIntoField("Image", webpImg);
    agHelper.AssertAttribute(widgetLocators.image + " img", "src", webpImg);
    deployMode.DeployApp(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper.AssertElementExist(image(webpImg));
    agHelper.AssertContains("Unable to display the image", "not.exist");
    deployMode.NavigateBacktoEditor();
    entityExplorer.SelectEntityByName("Image1", "Widgets");
    //Not working in cypress whereas works fine manually
    //svg
    // propPane.TypeTextIntoField("Image", svgImg);
    // agHelper.AssertAttribute(widgetLocators.image + " img", "src", svgImg)
    // deployMode.DeployApp(locators._widgetInDeployed(draggableWidgets.IMAGE));
    // agHelper.AssertElementExist(image(svgImg))
    // agHelper.AssertContains("Unable to display the image", "not.exist")
    // deployMode.NavigateBacktoEditor();
    // entityExplorer.SelectEntityByName("Image1", "Widgets");
    //png
    propPane.TypeTextIntoField("Image", pngImg);
    agHelper.AssertAttribute(widgetLocators.image + " img", "src", pngImg);
    deployMode.DeployApp(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper.AssertElementExist(image(pngImg));
    agHelper.AssertContains("Unable to display the image", "not.exist");
  });

  it("2. Validate Binding Image to Button Widget and checking the behaviour on enabling/disabling the button", function () {
    deployMode.NavigateBacktoEditor();
    entityExplorer.SelectEntityByName("Image1", "Widgets");
    propPane.TypeTextIntoField(
      "Image",
      "{{Button1.isDisabled ?'" + jpgImg + "':'" + gifImg + "'}}",
    );
    entityExplorer.DragNDropWidget(draggableWidgets.BUTTON, 200, 400);
    deployMode.DeployApp(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper.AssertElementExist(image(gifImg));
    agHelper.AssertContains("Unable to display the image", "not.exist");
    deployMode.NavigateBacktoEditor();
    entityExplorer.SelectEntityByName("Button1", "Widgets");
    propPane.TogglePropertyState("Disabled", "On");
    deployMode.DeployApp(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper.AssertElementExist(image(jpgImg));
    agHelper.AssertContains("Unable to display the image", "not.exist");
  });

  it("3. Verify Zoom In property", function () {
    deployMode.NavigateBacktoEditor();
    entityExplorer.SelectEntityByName("Image1", "Widgets");
    propPane.AssertPropertiesDropDownCurrentValue(
      "Max zoom level",
      "1x (No Zoom)",
    );
    propPane.AssertPropertiesDropDownValues("Max zoom level", [
      "1x (No Zoom)",
      "2x",
      "4x",
      "8x",
      "16x",
    ]);
    propPane.SelectPropertiesDropDown("Max zoom level", "16x");
    deployMode.DeployApp(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper.AssertCSS(widgetLocators.image, "cursor", "zoom-in");
    deployMode.NavigateBacktoEditor();
    entityExplorer.SelectEntityByName("Image1", "Widgets");
    propPane.EnterJSContext("Max zoom level", "{{(55>45)?1:16}}", true, true);
    deployMode.DeployApp(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper
      .GetElement(widgetLocators.image)
      .should("not.have.css", "cursor", "zoom-in");
  });

  it("4. Verify Object fit property", function () {
    agHelper.AssertCSS(widgetLocators.image, "background-size", "cover");
    deployMode.NavigateBacktoEditor();
    entityExplorer.SelectEntityByName("Image1", "Widgets");
    propPane.AssertPropertiesDropDownCurrentValue("Object fit", "Cover");
    propPane.AssertPropertiesDropDownValues("Object fit", [
      "Contain",
      "Cover",
      "Auto",
    ]);
    propPane.SelectPropertiesDropDown("Object fit", "Contain");
    deployMode.DeployApp(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper.AssertCSS(widgetLocators.image, "background-size", "contain");
    deployMode.NavigateBacktoEditor();
    entityExplorer.SelectEntityByName("Image1", "Widgets");
    propPane.EnterJSContext(
      "Object fit",
      "{{(55>45)?auto:contain}}",
      true,
      true,
    );
    deployMode.DeployApp(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper.AssertCSS(widgetLocators.image, "background-size", "auto");
  });

  it("5. Verify visible property is JS convertible", function () {
    deployMode.NavigateBacktoEditor();
    entityExplorer.SelectEntityByName("Image1", "Widgets");
    propPane.EnterJSContext("Visible", "{{(55>45)?false:true}}", true, true);
    deployMode.DeployApp();
    agHelper.AssertElementAbsence(
      locators._widgetInDeployed(draggableWidgets.IMAGE),
    );
    deployMode.NavigateBacktoEditor();
    entityExplorer.SelectEntityByName("Image1", "Widgets");
    propPane.EnterJSContext("Visible", "{{(45>55)?false:true}}", false, true);
    deployMode.DeployApp(locators._widgetInDeployed(draggableWidgets.IMAGE));
  });

  it("6. Verify image download", function () {
    agHelper.HoverElement(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper.AssertElementAbsence(widgetLocators.imageDownloadBtn);
    deployMode.NavigateBacktoEditor();
    entityExplorer.SelectEntityByName("Image1", "Widgets");
    agHelper.AssertExistingToggleState("enabledownload", "false");
    propPane.TogglePropertyState("enabledownload", "On");
    deployMode.DeployApp(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper.HoverElement(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper.AssertElementVisibility(widgetLocators.imageDownloadBtn);
    agHelper.AssertAttribute(widgetLocators.imageDownloadBtn, "href", jpgImg);
  });

  it("7. Validate enable rotation property", function () {
    agHelper.HoverElement(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper.AssertElementAbsence(widgetLocators.imageRotateClockwiseBtn);
    deployMode.NavigateBacktoEditor();
    entityExplorer.SelectEntityByName("Image1", "Widgets");
    agHelper.AssertExistingToggleState("enablerotation", "false");
    propPane.TogglePropertyState("enablerotation", "On");
    deployMode.DeployApp(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper.HoverElement(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper.AssertElementVisibility(widgetLocators.imageRotateClockwiseBtn);
    agHelper.AssertElementVisibility(
      widgetLocators.imageRotateAntiClockwiseBtn,
    );
    agHelper.GetNClick(widgetLocators.imageRotateClockwiseBtn);
    agHelper.AssertCSS(
      widgetLocators.image,
      "transform",
      "matrix(0, 1, -1, 0, 0, 0)",
    );
    agHelper.GetNClick(widgetLocators.imageRotateAntiClockwiseBtn);
    agHelper.AssertCSS(
      widgetLocators.image,
      "transform",
      "matrix(1, 0, 0, 1, 0, 0)",
    );
  });

  it("8. Verify image styles", function () {
    deployMode.NavigateBacktoEditor();
    entityExplorer.SelectEntityByName("Image1", "Widgets");
    propPane.MoveToTab("Style");
    propPane.EnterJSContext("Border radius", "", true, true);
    agHelper.AssertElementVisibility(widgetLocators.styleOrangeIcon);
    agHelper.AssertElementVisibility(widgetLocators.styleResetBtn);
    agHelper.GetNClick(widgetLocators.styleResetBtn);
    agHelper.AssertContains(
      "{{appsmith.theme.borderRadius.appBorderRadius}}",
      "be.visible",
    );
    propPane.ToggleJSMode("borderradius", false);
    agHelper.ContainsNClick("Medium");
    propPane.EnterJSContext("Border radius", "24px");
    deployMode.DeployApp(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper.AssertCSS(
      locators._widgetInDeployed(draggableWidgets.IMAGE) + " > div > div > div",
      "box-shadow",
      "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
    );
    agHelper.AssertCSS(
      locators._widgetInDeployed(draggableWidgets.IMAGE) + " > div > div > div",
      "border-radius",
      "24px",
    );
  });

  it("9. Validate OnClick Event", function () {
    deployMode.NavigateBacktoEditor();
    entityExplorer.SelectEntityByName("Image1", "Widgets");
    propPane.EnterJSContext(
      "onClick",
      "{{showAlert('Image Clicked!','success')}}",
      true,
    );
    propPane.ToggleJSMode("onClick", false);
    deployMode.DeployApp(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper.GetNClick(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper.ValidateToastMessage("Image Clicked!");
    deployMode.NavigateBacktoEditor();
    entityExplorer.SelectEntityByName("Image1", "Widgets");
    propPane.SelectPlatformFunction("onClick", "Show alert");
    agHelper.TypeText(
      propPane._actionSelectorFieldByLabel("Message"),
      "Image Clicked! (NEW)",
    );
    deployMode.DeployApp(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper.GetNClick(locators._widgetInDeployed(draggableWidgets.IMAGE));
    agHelper.ValidateToastMessage("Image Clicked! (NEW)");
  });
});
