import { useEffect, useState } from 'react';
import useCmapFetch from '../../hooks/cmapFetch.hook';
import { BackgroundDTO, BasicInfoFormDTO, InteractionKeyDTO, ProfilePageDTO, ProfilePageSchema, StyleDTO, UploadedFileDTO } from 'cmap2-shared';
import { useParams } from 'react-router-dom';

export default function useProlfilePage() {

  const { GET } = useCmapFetch();
  const [profile, setProfile] = useState<ProfilePageDTO | undefined | null>();
  const page = useParams().page ?? 'settings';

  useEffect(() => {
    GET('profile', ProfilePageSchema, data => setProfile(data), () => setProfile(null));
  }, []);

  function setBasicInfo(basicInfo: BasicInfoFormDTO) {
    setProfile(prevState => {
      if (!prevState) return undefined;
      return { ...prevState, ...basicInfo };
    });
  }

  function setImage(file: UploadedFileDTO) {
    setProfile(prevState => {
      if (!prevState) return undefined;
      return { ...prevState, image: file };
    });
  }

  function setInteractionKeys(interactionKeys: InteractionKeyDTO[]) {
    setProfile(prevState => {
      if (!prevState) return undefined;
      return { ...prevState, interactionKeys: interactionKeys };
    });
  }

  function setBackground(background: BackgroundDTO) {
    setProfile(prevState => {
      if (!prevState) return undefined;
      return { ...prevState, background: background };
    });
  }

  function setStyle(style: StyleDTO) {
    setProfile(prevState => {
      if (!prevState) return undefined;
      return { ...prevState, style: style };
    });
  }

  return { page, profile, setBasicInfo, setImage, setInteractionKeys, setBackground, setStyle };
}
