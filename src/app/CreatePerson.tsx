import React, { useState } from 'react';
import style from './app.module.scss';
import { popupHoc } from '../components/Popup';
import { Gender, Person } from '../types';

type CreatePersonProps = {
  onPersonCreate: (name: string, gender: Gender) => void;
  onClose: () => void;
  open: boolean;
};

const CreatePerson: React.FC<CreatePersonProps> = ({ onPersonCreate }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>(0);
  return (
    <div className={style.createPersonContent}>
      <label>
        Name:
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <div
        onChange={(e) => setGender((e.target as any).value === 'Male' ? 0 : 1)}
      >
        <label>
          <input
            value="Male"
            type="radio"
            name="gender"
            defaultChecked={gender === 0}
          />
          Male
        </label>
        <label>
          <input
            value="Female"
            type="radio"
            name="gender"
            defaultChecked={gender == 1}
          />
          Female
        </label>
      </div>
      <button disabled={!name} onClick={() => onPersonCreate(name, gender)}>
        Create
      </button>
    </div>
  );
};

export default popupHoc(CreatePerson, (prop) => ({
  open: prop.open,
  onClose: prop.onClose,
}));
