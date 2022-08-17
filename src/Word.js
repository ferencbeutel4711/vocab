import './Word.css';
import React from "react";
import Grid2 from "@mui/material/Unstable_Grid2";
import {Paper, TextField, Tooltip, Typography} from "@mui/material";
import {ArrowDownwardOutlined, ArrowUpwardOutlined, EditOutlined, PublishedWithChangesOutlined} from "@mui/icons-material";
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
            default:
                return this.state.solvable ? 'background.paper' : 'action.disabled';
        }
    }

    render() {
        const validate = () => {
            if (this.state.translation === this.props.word.german) {
                this.setState({validationStatus: 'success'});
            } else {
                this.setState({validationStatus: 'error'});
            }
        }

        return (
            <Paper sx={{bgcolor: this.getBackground(this.state.validationStatus), marginTop: '8px'}} elevation={this.state.solvable ? this.state.elevation : 2}
                   onMouseOut={() => this.setState({elevation: 2})}
                   onMouseOver={() => this.setState({elevation: 3})}>
                <Grid2 sx={{alignItems: 'center', padding: '8px', minHeight: '56px'}} container key={this.props.word.english + this.props.word.german}>
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
                            <Tooltip enterTouchDelay={0} title="validate">
                                {this.state.validationStatus === '' ? <PublishedWithChangesOutlined onClick={validate}/>
                                    : this.state.validationStatus === 'success' ? <ArrowDownwardOutlined onClick={this.props.promoteWord}/>
                                        : <ArrowUpwardOutlined onClick={this.props.demoteWord}/>
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
