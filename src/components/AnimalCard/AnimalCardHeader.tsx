import {Animal} from '../../types';
import {FC} from 'react';
import {parsePhoneNumber} from 'libphonenumber-js';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import {intlFormatDistance, parseISO} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const today = new Date();

type AnimalCardHeaderProps = {
  animal: Animal;
};

export const AnimalCardHeader: FC<AnimalCardHeaderProps> = (props) => {
  const {animal} = props;

  const phone = animal?.user?.phone;
  const href = phone
      ? `https://wa.me/${parsePhoneNumber(phone, 'BR').number}`
      : '';

  return (
      <CardHeader
          avatar={(
              <Avatar
                  alt={animal?.user?.name}
                  src={animal?.user?.avatar}
              />
          )}
          title={animal.user?.name}
          subheader={intlFormatDistance(
              parseISO(animal.createdAtISO),
              today,
              {locale: ptBR.code},
          )}
          action={
            <Tooltip title={`Conversar com ${animal?.user?.name}`}>
              <IconButton
                  aria-label="WhatsApp"
                  color="primary"
                  href={href}
                  target="_blank"
              >
                <WhatsAppIcon/>
              </IconButton>
            </Tooltip>
          }
      />
  );
};