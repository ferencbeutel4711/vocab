import './App.css';
import Grid2 from '@mui/material/Unstable_Grid2';
import React from "react";
import {AppBar, Backdrop, Button, Card, Container, createTheme, CssBaseline, FormControlLabel, Paper, Switch, TextField, ThemeProvider, Toolbar, Typography} from "@mui/material";
import produce from "immer";
import Word from "./Word";
import Logo from "./vocab_trainer_logo_3.png";
import Category from "./Category";
import dayjs from "dayjs";

const unitConfig = {
    daily: {
        promotion: 'threeDaily',
        demotion: 'daily',
        downtime: {
            value: 1,
            unit: 'day',
        },
    },
    threeDaily: {
        promotion: 'weekly',
        demotion: 'daily',
        downtime: {
            value: 3,
            unit: 'days',
        },
    },
    weekly: {
        promotion: 'monthly',
        demotion: 'threeDaily',
        downtime: {
            value: 1,
            unit: 'week',
        },
    },
    monthly: {
        promotion: 'threeMonthly',
        demotion: 'weekly',
        downtime: {
            value: 1,
            unit: 'month',
        }
    },
    threeMonthly: {
        promotion: 'threeMonthly',
        demotion: 'monthly',
        downtime: {
            value: 3,
            unit: 'months',
        }
    },
}

const initEmptyState = () => {
    return {
        categories: [],
        units: {
            daily: {
                name: 'daily',
                words: [],
            },
            threeDaily: {
                name: 'every three days',
                words: [],
            },
            weekly: {
                name: 'weekly',
                words: [],
            },
            monthly: {
                name: 'monthly',
                words: [],
            },
            threeMonthly: {
                name: 'every three months',
                words: [],
            },
        }
    }
}

const loadVocabulary = () => {
    const loadedState = localStorage.getItem('vocabulary');
    if (!loadedState) return initEmptyState();
    return JSON.parse(loadedState);
}

const saveVocabulary = (vocabulary) => {
    localStorage.setItem('vocabulary', JSON.stringify(vocabulary));
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addingWord: false,
            editingWord: false,
            addingCategory: false,
            vocabulary: loadVocabulary(),
            englishWordToAdd: '',
            germanWordToAdd: '',
            categoriesToAppend: [],
            categoryToAdd: '',
            showAll: false,
            wordToEdit: null,
        }
    }

    render() {
        const saveAddedWord = () => {
            const newState = produce(this.state, draft => {
                draft.vocabulary.units.daily.words.push({
                    english: this.state.englishWordToAdd,
                    german: this.state.germanWordToAdd,
                    categories: this.state.categoriesToAppend,
                    solveAt: dayjs(),
                });
                draft.addingWord = false;
                draft.englishWordToAdd = '';
                draft.germanWordToAdd = '';
                draft.categoriesToAppend = [];
            });

            this.setState(newState);
            saveVocabulary(newState.vocabulary);
        }

        const saveEditedWord = () => {
            const newState = produce(this.state, draft => {
                draft.vocabulary.units[this.state.wordToEdit.unit].words = draft.vocabulary.units[this.state.wordToEdit.unit].words
                    .map((word) => word.english === this.state.wordToEdit.english && word.german === this.state.wordToEdit.german ?
                        {...word, english: this.state.englishWordToAdd, german: this.state.germanWordToAdd, categories: this.state.categoriesToAppend} :
                        word
                    );
                draft.editingWord = false;
                draft.englishWordToAdd = '';
                draft.germanWordToAdd = '';
                draft.categoriesToAppend = [];
            });

            this.setState(newState);
            saveVocabulary(newState.vocabulary);
        }

        const deleteWord = () => {
            const newState = produce(this.state, draft => {
                draft.vocabulary.units[this.state.wordToEdit.unit].words = draft.vocabulary.units[this.state.wordToEdit.unit].words
                    .filter((word) => word.english !== this.state.wordToEdit.english || word.german !== this.state.wordToEdit.german);
                draft.editingWord = false;
                draft.englishWordToAdd = '';
                draft.germanWordToAdd = '';
                draft.categoriesToAppend = [];
            });

            this.setState(newState);
            saveVocabulary(newState.vocabulary);
        }

        const saveCategory = () => {
            const newState = produce(this.state, draft => {
                draft.vocabulary.categories.push(this.state.categoryToAdd);
                draft.addingCategory = false;
                draft.categoryToAdd = '';
            });

            this.setState(newState);
            saveVocabulary(newState.vocabulary);
        }

        const editWord = (word, unit) => {
            this.setState({
                germanWordToAdd: word.german,
                englishWordToAdd: word.english,
                editingWord: true,
                categoriesToAppend: word.categories,
                wordToEdit: {...word, unit},
            });
        }

        const promoteWord = (word, unit) => {
            const newWord = {...word, solveAt: dayjs().add(unitConfig[unitConfig[unit].promotion].downtime.value, unitConfig[unitConfig[unit].promotion].downtime.unit)};

            const newState = produce(this.state, draft => {
                draft.vocabulary.units[unit].words = draft.vocabulary.units[unit].words.filter((w) => w.english !== word.english && w.german !== word.german);
                draft.vocabulary.units[unitConfig[unit].promotion].words.push(newWord);
            });

            this.setState(newState);
            saveVocabulary(newState.vocabulary);
        }

        const demoteWord = (word, unit) => {
            const newWord = {...word, solveAt: dayjs().add(unitConfig[unitConfig[unit].demotion].downtime.value, unitConfig[unitConfig[unit].demotion].downtime.unit)};

            const newState = produce(this.state, draft => {
                draft.vocabulary.units[unit].words = draft.vocabulary.units[unit].words.filter((w) => w.english !== word.english && w.german !== word.german);
                draft.vocabulary.units[unitConfig[unit].demotion].words.push(newWord);
            });

            this.setState(newState);
            saveVocabulary(newState.vocabulary);
        }

        const keepWord = (word, unit) => {
            const newWord = {...word, solveAt: dayjs().add(unitConfig[unit].downtime.value, unitConfig[unit].downtime.unit)};

            const newState = produce(this.state, draft => {
                draft.vocabulary.units[unit].words = draft.vocabulary.units[unit].words.filter((w) => w.english !== word.english && w.german !== word.german);
                draft.vocabulary.units[unit].words.push(newWord);
            });

            this.setState(newState);
            saveVocabulary(newState.vocabulary);
        }

        return (
            <ThemeProvider theme={createTheme({palette: {mode: 'dark'}})}>
                <CssBaseline/>
                <Paper elevation={1} sx={{maxWidth: '900px', margin: '0 auto'}}>
                    <main className="App">
                        <AppBar position="static">
                            <Toolbar>
                                <img className="nav-logo nav-item" src={Logo} alt="logo"/>
                                <Typography sx={{marginLeft: '48px', cursor: 'pointer'}} variant="h6" onClick={() => this.setState({addingWord: true})}>ADD WORD</Typography>
                                <Typography sx={{marginLeft: '24px', cursor: 'pointer'}} variant="h6" onClick={() => this.setState({addingCategory: true})}>
                                    ADD CATEGORY
                                </Typography>
                                <Typography sx={{marginLeft: '24px', cursor: 'pointer'}} variant="h6" onClick={() => this.setState({showWordList: true})}>WORDLIST</Typography>
                                <FormControlLabel sx={{position: 'absolute', right: '0px'}} control={
                                    <Switch onChange={() => this.setState({showAll: !this.state.showAll})}/>
                                } label="show all"/>
                            </Toolbar>
                        </AppBar>
                        <Grid2 container>
                            {Object.keys(this.state.vocabulary.units).map((unit) =>
                                <Container key={unit}>
                                    <Grid2 xs={12} display="flex" justifyContent="center">
                                        <Typography variant="h5" sx={{marginTop: '32px'}}>
                                            {this.state.vocabulary.units[unit].name} ({this.state.vocabulary.units[unit].words.filter((word) => dayjs().isAfter(word.solveAt)).length})
                                        </Typography>
                                    </Grid2>
                                    {this.state.vocabulary.units[unit].words
                                        .filter((word) => this.state.showAll || dayjs().isAfter(word.solveAt))
                                        .map((word) =>
                                            <Word
                                                word={word}
                                                promoteWord={() => promoteWord(word, unit)}
                                                demoteWord={() => demoteWord(word, unit)}
                                                keepWord={() => keepWord(word, unit)}
                                                editWord={() => editWord(word, unit)}
                                                key={word.english + word.german}
                                            />
                                        )}
                                </Container>
                            )}
                        </Grid2>
                        <Backdrop open={this.state.addingWord || this.state.editingWord} onClick={() => this.setState({addingWord: false, editingWord: false})}
                                  sx={{zIndex: 99}}>
                            {this.state.addingWord || this.state.editingWord ?
                                <Card sx={{padding: '32px'}} variant="outlined" onClick={(e) => e.stopPropagation()}>
                                    <Grid2 container>
                                        <Grid2 xs={12}>
                                            <Typography sx={{marginBottom: '32px'}} variant="h3">{this.state.addingWord ? 'add word' : 'edit word'}</Typography>
                                        </Grid2>
                                        <Grid2 xs={12}>
                                            <TextField value={this.state.germanWordToAdd}
                                                       onChange={(event) => this.setState({germanWordToAdd: event.target.value})}
                                                       label="german word" sx={{marginRight: '32px'}}/>
                                            <TextField value={this.state.englishWordToAdd}
                                                       onChange={(event) => this.setState({englishWordToAdd: event.target.value})}
                                                       label="english translation"/>
                                        </Grid2>
                                        <Grid2 xs={12}>
                                            {this.state.vocabulary.categories.map((category) => <Category
                                                key={category} category={category}
                                                selected={this.state.wordToEdit && this.state.wordToEdit.categories.includes(category)}
                                                onCategorySelected={() => this.setState({categoriesToAppend: [...this.state.categoriesToAppend, category]})}
                                                onCategoryDeselected={() => this.setState({categoriesToAppend: this.state.categoriesToAppend.filter((c) => c !== category)})}/>
                                            )}
                                        </Grid2>
                                        <Grid2 xs={5}>
                                            <Button sx={{marginTop: '32px'}} onClick={this.state.addingWord ? saveAddedWord : saveEditedWord} variant="contained">
                                                Save
                                            </Button>
                                        </Grid2>
                                        <Grid2 xs={2}/>
                                        <Grid2 xs={5}>
                                            {this.state.editingWord ?
                                                <Button sx={{marginTop: '32px'}} onClick={deleteWord} variant="outlined" color="error">
                                                    Delete
                                                </Button>
                                                : ''
                                            }
                                        </Grid2>
                                    </Grid2>
                                </Card>
                                : ''
                            }
                        </Backdrop>
                        <Backdrop open={this.state.addingCategory} onClick={() => this.setState({addingCategory: false})}
                                  sx={{zIndex: 99}}>
                            <Card sx={{padding: '32px'}} variant="outlined" onClick={(e) => e.stopPropagation()}>
                                <Grid2 container>
                                    <Grid2 xs={12}>
                                        <Typography sx={{marginBottom: '32px'}} variant="h3">Add Category</Typography>
                                    </Grid2>
                                    <Grid2 xs={12}>
                                        <TextField value={this.state.categoryToAdd}
                                                   onChange={(event) => this.setState({categoryToAdd: event.target.value})}
                                                   label="Category"/>
                                    </Grid2>
                                    <Grid2 xs={12}>
                                        <Button sx={{marginTop: '32px'}} onClick={saveCategory} variant="contained">
                                            Save Category
                                        </Button>
                                    </Grid2>
                                </Grid2>
                            </Card>
                        </Backdrop>
                    </main>
                </Paper>
            </ThemeProvider>
        );
    }
}

export default App;
