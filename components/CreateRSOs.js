import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormContainer from './FormContainer';
import classNames from 'classnames';
import Router from 'next/router';
import ErrorMessage from './Error';
import assign from 'lodash/assign';
import remove from 'lodash/remove';
import Break from './Break';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

const styles = theme => ({
    textField: {
        flexBasis: 100,
    },
});

const fakestudents = [
    {
        uid: 1,
        name: 'Huong',
    },
    {
        uid: 2,
        name: 'Weilin',
    },
    {
        uid: 3,
        name: 'Vicky',
    },
];
class CreateRSOs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            form: {
                rso_name: '',
                rso_university: '',
                rso_description: '',
                rso_admin_id: '',
                rso_members: [],
            },
            universityStudentChoices: [],
            errorMessage: '',
            loading: false,
        };
    }

    async componentDidMount() {
        try {
            const res = await axios.post('/universityStudents', {
                university: this.props.user.university,
            });
            this.setState({
                user: this.props.user,
                form: assign({}, this.state.form, {
                    rso_university: this.props.user.university,
                }),
                universityStudentChoices: res.data.allStudents,
            });
            console.log('this.state', this.state);
        } catch (e) {
            console.error(e);
        }
    }

    handleChange = prop => event => {
        const modifiedForm = assign({}, this.state.form, {
            [prop]: event.target.value,
        });
        this.setState({ form: modifiedForm });
    };

    handleSelect = event => {
        let modified_rso_members = this.state.form.rso_members;
        modified_rso_members.push(event.target.value);

        this.setState({
            form: assign({}, this.state.form, {
                rso_members: modified_rso_members,
            }),
            universityStudentChoices: remove(
                this.state.universityStudentChoices,
                student => student.uid !== event.target.value.uid,
            ),
        });
    };

    validateForm = () => {
        const errorMessage = `Please fill out all fields of the form. You also must select at least 5 members to be in the new RSO.`;
        const validation = map(this.state.form, property => property.length > 0);
        console.log('validation is', validation);

        if (validation.includes(false) || this.state.form.rso_members.length < 5) {
            this.setState({ errorMessage: errorMessage });
            return false;
        }

        this.setState({ errorMessage: '' });
        return true;
    };

    handleSubmit = async () => {
        try {
            this.setState({ loading: true });
            const validation = this.validateForm();
            
            this.setState({ loading: false });
        } catch (err) {
            this.setState({ loading: false });
            if (err.code === 'auth/user-not-found') {
                this.setState({
                    errorMessage: `${
                        this.state.email
                    } is not registered in our system.`,
                });
            } else {
                this.setState({
                    errorMessage: `${err.message}`,
                });
            }
        }
    };

    renderChoices = () => {
        return (
            <Card>
                {this.state.form.rso_members.map(student => (
                    <CardContent key={student.uid}>
                        {`${student.firstName} ${student.lastName}`}
                    </CardContent>
                ))}
            </Card>
        );
    };

    handleRadioChoice = event => {
        this.setState({
            form: assign({}, this.state.form, {
                rso_admin_id: event.target.value,
            }),
        });
    };

    renderAdminChoices = () => {
        return (
            <FormControl>
                <FormLabel component="legend">Admin Options</FormLabel>
                <RadioGroup
                    aria-label="Gender"
                    name="gender1"
                    value={this.state.form.rso_admin_id}
                    onChange={this.handleRadioChoice}
                >
                    {this.state.form.rso_members.map(member => (
                        <FormControlLabel
                            key={member.uid}
                            value={member.uid}
                            control={<Radio />}
                            label={`${member.firstName} ${member.lastName}`}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        );
    };

    render() {
        const { classes } = this.props;
        console.log('form is', this.state.form);
        return (
            <FormContainer
                title="Create a New RSO"
                loading={this.state.loading}
                minWidth={'400px'}
            >
                <TextField
                    label="RSO Name"
                    className={classNames(classes.textField)}
                    type="text"
                    name="rso_name"
                    value={this.state.form.rso_name}
                    onChange={this.handleChange('rso_name')}
                />
                <TextField
                    label="University"
                    className={classNames(classes.textField)}
                    type="text"
                    name="rso_university"
                    value={this.state.form.rso_university}
                    disabled={true}
                />
                <TextField
                    label="Description"
                    className={classNames(classes.textField)}
                    type="text"
                    name="rso_description"
                    value={this.state.form.rso_description}
                    onChange={this.handleChange('rso_description')}
                    multiline={true}
                    rowsMax={4}
                />
                <InputLabel htmlFor="students-selector">Members</InputLabel>
                <Select
                    value={'Select members'}
                    placeholder={'Please select at least five students'}
                    onChange={this.handleSelect}
                    inputProps={{
                        name: 'student-members',
                        id: 'students-selector',
                    }}
                >
                    {this.state.universityStudentChoices.map(student => (
                        <MenuItem value={student} key={student.uid}>
                            {`${student.firstName} ${student.lastName}`}
                        </MenuItem>
                    ))}
                </Select>
                <Break height={15} />
                {this.renderChoices()}
                <Break height={15} />
                {this.renderAdminChoices()}
                <Break height={15} />
                <ErrorMessage message={this.state.errorMessage} />
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={this.handleSubmit}
                >
                    Submit
                </Button>
            </FormContainer>
        );
    }
}

CreateRSOs.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreateRSOs);
