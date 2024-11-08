import { LayoutDTO, ButtonDTO, GroupDTO, ParameterBadgeDTO, UploadedFileDTO, LayoutFormDTO } from 'cmap2-shared';

export type LayoutsReducerAction = { type: 'setLayouts', layouts: LayoutDTO[] } |
  { type: 'addLayout', layout: LayoutDTO } |
  { type: 'editLayout', layout: LayoutDTO } |
  { type: 'removeLayout', layout: LayoutDTO } |
  // { type: 'saveControlParameters', controlParameters: ControlParameterDTO[], layoutId: string } |
  // { type: 'removeControlParameter', controlParameter: ControlParameterDTO, layoutId: string } |
  { type: 'saveParameterBadges', layoutId: string, parameterBadges: ParameterBadgeDTO[] } |
  { type: 'removeParameterBadge', layoutId: string, parameterBadge: ParameterBadgeDTO } |
  { type: 'addGroup', layoutId: string, group: GroupDTO } |
  { type: 'editGroup', layoutId: string, group: GroupDTO } |
  { type: 'removeGroup', layoutId: string, groupId: string } |
  { type: 'setGroupOrder', layoutId: string, groups: GroupDTO[] } |
  { type: 'addButton', layoutId: string, groupId: string, button: ButtonDTO } |
  { type: 'editButton', layoutId: string, groupId: string, button: ButtonDTO } |
  { type: 'removeButton', layoutId: string, groupId: string, buttonId: string } |
  { type: 'setButtonOrder', layoutId: string, groupId: string, buttons: ButtonDTO[] } |
  { type: 'changeButtonPicture', layoutId: string, groupId: string, buttonId: string, image: UploadedFileDTO | null };

export default function layoutsReducer(state: LayoutDTO[], action: LayoutsReducerAction) {
  switch (action.type) {
    case 'setLayouts':
      return action.layouts;
    case 'addLayout':
      return [...state, action.layout];
    case 'editLayout':
      return state.map(layout => {
        if (layout.id === action.layout.id) return {...layout, ...action.layout};
        return layout;
      });
    case 'removeLayout':
      return state.filter(layout => layout.id !== action.layout.id);
    // case 'saveControlParameters':
    //   return state.map(layout => {
    //     if (layout.id === action.layoutId) layout.controlParameters = action.controlParameters;
    //     return layout;
    //   });
    // case 'removeControlParameter':
    //   return state.map(layout => {
    //     if (layout.id === action.layoutId) layout.controlParameters = layout.controlParameters?.filter(cp => cp.id !== action.controlParameter.id);
    //     return layout;
    //   });
    case 'saveParameterBadges':
      return state.map(layout => {
        if (layout.id === action.layoutId) layout.parameterBadges = action.parameterBadges;
        return layout;
      });
    case 'removeParameterBadge':
      return state.map(layout => {
        if (layout.id === action.layoutId) layout.parameterBadges = layout.parameterBadges?.filter(b => b.id !== action.parameterBadge.id);
        return layout;
      });
    case 'addGroup':
      return state.map(layout => {
        if (layout.id === action.layoutId) {
          if (!layout.groups) layout.groups = [];
          layout.groups.push(action.group);
        }
        return layout;
      });
    case 'editGroup':
      return state.map(layout => {
        if (layout.id === action.layoutId) {
          layout.groups = layout.groups?.map(group => {
            if (group.id === action.group.id) return {...group, ...action.group};
            return group;
          });
        }
        return layout;
      });
    case 'removeGroup':
      return state.map(layout => {
        if (layout.id === action.layoutId) layout.groups = layout.groups?.filter(group => group.id !== action.groupId);
        return layout;
      });
    case 'setGroupOrder':
      return state.map(layout => {
        if (layout.id === action.layoutId) {
          layout.groups = action.groups
        }
        return layout;
      });
    case 'addButton':
      return state.map(layout => {
        if (layout.id === action.layoutId && layout.groups) {
          const tempGroup = layout.groups.find(group => group.id === action.groupId);
          if (tempGroup) {
            if (!tempGroup.buttons) tempGroup.buttons = [];
            tempGroup.buttons.push(action.button);
          }
        }
        return layout;
      });
    case 'editButton':
      return state.map(layout => {
        if (layout.id === action.layoutId) {
          layout.groups = layout.groups?.map(group => {
            if (group.id === action.groupId) {
              group.buttons = group.buttons?.map(button => {
                if (button.id === action.button.id) return {...button, ...action.button, id: action.button.id!};
                return button;
              });
            }
            return group;
          });
        }
        return layout;
      });
    case 'removeButton':
      return state.map(layout => {
        if (layout.id === action.layoutId) {
          layout.groups = layout.groups?.map(group => {
            if (group.id === action.groupId) group.buttons = group.buttons?.filter(button => button.id !== action.buttonId);
            return group;
          });
        }
        return layout;
      });
    case 'setButtonOrder':
      return state.map(layout => {
        if (layout.id === action.layoutId) {
          layout.groups = layout.groups?.map(group => {
            if (group.id === action.groupId) {
              group.buttons = action.buttons
            }
            return group;
          });
        }
        return layout;
      });
    case 'changeButtonPicture':
      return state.map(layout => {
        if (layout.id === action.layoutId) {
          layout.groups = layout.groups?.map(group => {
            if (group.id === action.groupId) {
              group.buttons = group.buttons?.map(button => {
                if (button.id === action.buttonId) return {...button, image: action.image};
                return button;
              });
            }
            return group;
          });
        }
        return layout;
      });
    default:
      return state;
  }
}
