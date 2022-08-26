import './Word.css';
import React from "react";
import Grid2 from "@mui/material/Unstable_Grid2";
import {Paper, TextField, Tooltip, Typography} from "@mui/material";
import {ArrowDownwardOutlined, ArrowLeftOutlined, ArrowUpwardOutlined, EditOutlined, PublishedWithChangesOutlined} from "@mui/icons-material";
import dayjs from "dayjs";

class Word extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            translation: '',
            elevation: 2,
            validationStatus: '',
            solvable: dayjs().isAfter(this.props.word.solveAt),
        }
    }

    getBackground(validationStatus) {
        switch (validationStatus) {
            case 'success':
                return 'success.dark';
            case 'error':
                return 'error.dark';
            case 'warning':
                return 'warning.dark';
            default:
                return this.state.solvable ? 'background.paper' : 'action.disabled';
        }
    }

    render() {
        const isMajorMistake = () => {
            return this.state.translation !== this.props.word.german;
        }

        const isArticle = (word) => ['der', 'die', 'das'].includes(word);

        const isMinorMistake = () => {
            if (this.state.translation === this.props.word.german) return false;

            const correctWords = this.props.word.german.split(' ');
            const translationWords = this.state.translation.split(' ');

            if (correctWords.length > 1 && !isArticle(correctWords[0])) return this.state.translation.toLowerCase() === this.props.word.german.toLowerCase();
            if (translationWords.length > 1) return translationWords[1].toLowerCase() === correctWords[1].toLowerCase();

            return translationWords[0].toLowerCase() === correctWords[correctWords.length - 1].toLowerCase();
        }

        const validate = () => {
            if (isMinorMistake()) {
                this.setState({validationStatus: 'warning'});
            } else if (isMajorMistake()) {
                this.setState({validationStatus: 'error'});
            } else {
                this.setState({validationStatus: 'success'});
            }
        }

        const actionButtonTooltip = () => {
            if (this.state.validationStatus === '') return 'validate';
            else if (this.state.validationStatus === 'success') return 'move word down';
            else if (this.state.validationStatus === 'error') return 'move word up';
            else if (this.state.validationStatus === 'warning') return 'keep word';
            else return '';
        }

        return (
            <Paper sx={{bgcolor: this.getBackground(this.state.validationStatus), marginTop: '4px'}} elevation={this.state.solvable ? this.state.elevation : 2}
                   onMouseOut={() => this.setState({elevation: 2})}
                   onMouseOver={() => this.setState({elevation: 3})}>
                <Grid2 sx={{alignItems: 'center', padding: '4px', minHeight: '48px'}} container key={this.props.word.english + this.props.word.german}>
                    <Grid2 xs={4}>
                        <Tooltip enterTouchDelay={0}
                                 title={this.props.word.categories.length > 0 ? this.props.word.categories.map((category) => <p key={category}>{category}</p>) : 'no categories'}>
                            <Typography variant="span">{this.props.word.english}</Typography>
                        </Tooltip>
                    </Grid2>
                    <Grid2 xs={4}>
                        {this.state.validationStatus === '' && this.state.solvable ?
                            <TextField value={this.state.translation}
                                       onChange={(event) => this.setState({translation: event.target.value})}
                                       label="translation" size="small"/>
                            : <Typography variant="span">{this.props.word.german}</Typography>
                        }
                    </Grid2>
                    <Grid2 xs={1}/>
                    <Grid2 sx={{alignItems: 'center', height: '24px'}} xs={3}>
                        {this.state.solvable ?
                            <Tooltip enterTouchDelay={0} title={actionButtonTooltip()}>
                                {this.state.validationStatus === '' ? <PublishedWithChangesOutlined onClick={validate}/>
                                    : this.state.validationStatus === 'success' ? <ArrowDownwardOutlined onClick={this.props.promoteWord}/>
                                        : this.state.validationStatus === 'error' ? <ArrowUpwardOutlined onClick={this.props.demoteWord}/>
                                            : <ArrowLeftOutlined onClick={this.props.keepWord}/>
                                }
                            </Tooltip>
                            : <div style={{width: '24px', height: '1px', display: 'inline-block'}}/>
                        }
                        <Tooltip enterTouchDelay={0} title="edit">
                            <EditOutlined sx={{marginLeft: '16px'}} onClick={this.props.editWord}/>
                        </Tooltip>
                    </Grid2>
                </Grid2>
            </Paper>
        )
    }
}

export default Word;
