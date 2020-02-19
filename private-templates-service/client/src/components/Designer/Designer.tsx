import React, { useEffect } from 'react';
import requireAuthentication from '../../utils/requireAuthentication';

import { RootState } from '../../store/rootReducer';
import { connect } from 'react-redux';
import { UserType } from '../../store/auth/types';
import { useHistory } from 'react-router-dom';
import { updateTemplate } from '../../store/currentTemplate/actions';

//ACDesigner
import * as monaco from 'monaco-editor';
import markdownit from 'markdown-it';
import * as ACDesigner from 'adaptivecards-designer';

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    templateID: state.currentTemplate.templateID,
    templateJSON: state.currentTemplate.templateID,
    templateName: state.currentTemplate.templateName,
    sampleDataJSON: state.currentTemplate.sampleDataJSON
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateTemplate: (templateID: string, templateJSON: string, templateName: string, sampleDataJSON: string) => {
      dispatch(updateTemplate(templateID, templateJSON, templateName, sampleDataJSON));
    }
  }
}

interface DesignerProps {
  isAuthenticated: boolean;
  user?: UserType;
  templateID: string;
  templateJSON: string;
  templateName: string;
  sampleDataJSON: string;
  updateTemplate: (templateID: string, templateJSON: string, templateName: string, sampleDataJSON: string) => any;
}

const Designer = (props: DesignerProps) => {

  useEffect(() => {
    const element = document.getElementById("designer-container");
    if (element) {
      designer.attachTo(element);
    }

    designer.monacoModuleLoaded(monaco);
  }, [])

  let history = useHistory();

  ACDesigner.GlobalSettings.enableDataBindingSupport = true;
  ACDesigner.GlobalSettings.showSampleDataEditorToolbox = true;

  ACDesigner.CardDesigner.onProcessMarkdown = (text: string, result: { didProcess: boolean, outputHtml?: string }) => {
    result.outputHtml = new markdownit().render(text);
    result.didProcess = true;
  }

  let designer = initDesigner();

  let closeButton = new ACDesigner.ToolbarButton("closeButton", "Close", "", (sender) => (history.goBack()));
  closeButton.separator = true;
  designer.toolbar.insertElementAfter(closeButton, ACDesigner.CardDesigner.ToolbarCommands.TogglePreview);

  let publishButton = new ACDesigner.ToolbarButton("publishButton", "Publish", "", (sender) => (alert("Published!")));
  publishButton.separator = true;
  designer.toolbar.insertElementAfter(publishButton, ACDesigner.CardDesigner.ToolbarCommands.TogglePreview);

  let saveButton = new ACDesigner.ToolbarButton("saveButton", "Save", "", (sender) => (onSave(designer, props)));
  saveButton.separator = true;
  designer.toolbar.insertElementAfter(saveButton, ACDesigner.CardDesigner.ToolbarCommands.TogglePreview);

  designer.sampleData = "";

  return <div id="designer-container" dangerouslySetInnerHTML={{ __html: "dangerouslySetACDesigner" }}></div>;
}

function onSave(designer: ACDesigner.CardDesigner, props: DesignerProps): void {
  if (props.templateJSON !== JSON.stringify(designer.getCard()) || props.sampleDataJSON !== designer.sampleData) {
    props.updateTemplate(props.templateID, JSON.stringify(designer.getCard()), props.templateName, designer.sampleData);
    console.log("idddddd: " + props.templateID)
  }
}

function initDesigner(): ACDesigner.CardDesigner {
  let hostContainers: Array<ACDesigner.HostContainer> = [];

  hostContainers.push(new ACDesigner.WebChatContainer("Bot Framework WebChat", "containers/webchat-container.css"));
  hostContainers.push(new ACDesigner.CortanaContainer("Cortana Skills", "containers/cortana-container.css"));
  hostContainers.push(new ACDesigner.OutlookContainer("Outlook Actionable Messages", "containers/outlook-container.css"));
  hostContainers.push(new ACDesigner.TimelineContainer("Windows Timeline", "containers/timeline-container.css"));
  hostContainers.push(new ACDesigner.DarkTeamsContainer("Microsoft Teams - Dark", "containers/teams-container-dark.css"));
  hostContainers.push(new ACDesigner.LightTeamsContainer("Microsoft Teams - Light", "containers/teams-container-light.css"));
  hostContainers.push(new ACDesigner.BotFrameworkContainer("Bot Framework Other Channels (Image render)", "containers/bf-image-container.css"));
  hostContainers.push(new ACDesigner.ToastContainer("Windows Notifications (Preview)", "containers/toast-container.css"));

  let designer = new ACDesigner.CardDesigner(hostContainers);
  designer.sampleCatalogueUrl = window.location.origin + "/ACDesigner";
  designer.assetPath = window.location.origin + "/ACDesigner";

  return designer;
}

export default connect(mapStateToProps, mapDispatchToProps)(requireAuthentication(Designer));
