import { t } from '../text';
import { InfoModal, ModalButton } from './InfoModal';

export class ConfirmModal {
  public static show(
    title: string,
    content: string
  ): Promise<boolean> {
    const buttons: ModalButton<boolean>[] = [
      {
        text: t('global.cancel'),
        value: false,
        variant: 'secondary',
      },
      {
        text: t('global.confirm'),
        value: true,
        variant: 'primary',
      },
    ];
    return InfoModal.show(title, content, buttons);
  }
}