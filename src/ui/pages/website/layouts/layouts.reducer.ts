import { ButtonDTO, GroupDTO, LayoutDTO, ParameterBadgeDTO, PresetDTO, UploadedFileDTO } from 'cmap2-shared';

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
  { type: 'addPreset', layoutId: string, preset: PresetDTO } |
  { type: 'editPreset', layoutId: string, preset: PresetDTO } |
  { type: 'removePreset', layoutId: string, presetId: string } |
  { type: 'setPresetOrder', layoutId: string, presets: PresetDTO[] } |
  { type: 'changeButtonPicture', layoutId: string, groupId: string, buttonId: string, image: UploadedFileDTO | null } |
  { type: 'changePresetPicture', layoutId: string, presetId: string, image: UploadedFileDTO | null };

export default function layoutsReducer(state: LayoutDTO[], action: LayoutsReducerAction) {
  switch (action.type) {
    case 'setLayouts':
      return action.layouts;
    case 'addLayout':
      return [...state, action.layout];
    case 'editLayout':
      return state.map(layout => {
        if (layout.id === action.layout.id) return { ...layout, ...action.layout };
        return layout;
      });
    case 'removeLayout':
      return state.filter(layout => layout.id !== action.layout.id);
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
    case 'addPreset':
      return state.map(layout => {
        if (layout.id === action.layoutId) {
          if (!layout.presets) layout.presets = [];
          layout.presets.push(action.preset);
        }
        return layout;
      });
    case 'editPreset':
      return state.map(layout => {
        if (layout.id === action.layoutId) {
          layout.presets = layout.presets?.map(preset => {
            if (preset.id === action.preset.id) return { ...preset, ...action.preset };
            return preset;
          });
        }
        return layout;
      });
    case 'removePreset':
      return state.map(layout => {
        if (layout.id === action.layoutId) {
          // get order number for deleted preset
          const missingOrder = layout.presets?.find(g => g.id === action.presetId)?.order;
          layout.presets = layout.presets?.filter(preset => preset.id !== action.presetId);
          // set order - 1 for presets that are bigger other than the deleted
          if (missingOrder) {
            layout.presets?.forEach(p => {
              if (p.order > missingOrder) p.order--;
            });
          }
        }
        return layout;
      });
    case 'setPresetOrder':
      return state.map(layout => {
        if (layout.id === action.layoutId) {
          layout.presets = action.presets;
        }
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
            if (group.id === action.group.id) return { ...group, ...action.group };
            return group;
          });
        }
        return layout;
      });
    case 'removeGroup':
      return state.map(layout => {
        if (layout.id === action.layoutId) {
          // get order number for deleted group
          const missingOrder = layout.groups?.find(g => g.id === action.groupId)?.order;
          layout.groups = layout.groups?.filter(group => group.id !== action.groupId);
          // set order - 1 for groups that are bigger other than the deleted
          if (missingOrder) {
            layout.groups?.forEach(g => {
              if (g.order > missingOrder) g.order--;
            });
          }
        }
        return layout;
      });
    case 'setGroupOrder':
      return state.map(layout => {
        if (layout.id === action.layoutId) {
          layout.groups = action.groups;
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
                if (button.id === action.button.id) return { ...button, ...action.button, id: action.button.id! };
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
            if (group.id === action.groupId) {
              // get order number for deleted button
              const missingOrder = group.buttons?.find(b => b.id === action.buttonId)?.order;
              group.buttons = group.buttons?.filter(button => button.id !== action.buttonId);
              // set order - 1 for buttons that are bigger other than the deleted
              if (missingOrder) {
                group.buttons?.forEach(b => {
                  if (b.order > missingOrder) b.order--;
                });
              }
            }
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
              group.buttons = action.buttons;
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
                if (button.id === action.buttonId) return { ...button, image: action.image };
                return button;
              });
            }
            return group;
          });
        }
        return layout;
      });
    case 'changePresetPicture':
      return state.map(layout => {
        if (layout.id === action.layoutId) {
          layout.presets = layout.presets?.map(preset => {
            if (preset.id === action.presetId) return { ...preset, image: action.image };
            return preset;
          });
        }
        return layout;
      });
    default:
      return state;
  }
}
