import React from 'react';
import Popup from '../components/Popup';
import { Gender, PersonType } from '../types';
import CreatePerson from './CreatePerson';

type StateType<Extra = {}> = {
  action: (param: { name: string; gender: Gender } & Extra) => void;
  show: boolean;
  setShow: (v: boolean) => void;
};

type CreateUpdateModalProps = {
  create: StateType;
  update: StateType<{ id: string }>;
  person?: PersonType;
};

const CreateUpdateModal: React.FC<CreateUpdateModalProps> = ({
  create,
  update,
  person,
}) => {
  return (
    <>
      <Popup open={create.show} onClose={() => create.setShow(false)}>
        <CreatePerson
          onSubmit={(name, gender) => {
            create.action({ name, gender });
            create.setShow(false);
          }}
        />
      </Popup>
      <Popup open={update.show} onClose={() => update.setShow(false)}>
        <CreatePerson
          onSubmit={(name, gender) => {
            update.action({
              id: person?.id as string,
              name,
              gender,
            });
            update.setShow(false);
          }}
          name={person?.name}
          gender={person?.gender}
        />
      </Popup>
    </>
  );
};

export default CreateUpdateModal;
