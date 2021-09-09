import { Button, Primary, Secondary, Purchase, Curate } from '../components/button/index';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    to: {},
    href: {},
    disabled: { control: { type: 'boolean' }},
    fit: { control: { type: 'boolean' }},
    label: { control: { type: 'text' }},
  }
};

export const Basic = ({ label = 'button', ...rest }) => <div>
  <Button {...rest}><Primary>{ label }</Primary></Button><br/>
  <Button {...rest}><Secondary>{ label }</Secondary></Button><br/>
  <Button {...rest}><Purchase>{ label }</Purchase></Button><br/>
  <Button {...rest}><Curate>{ label }</Curate></Button><br/>
</div>;
