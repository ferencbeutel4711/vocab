import React from "react";
import {Chip} from "@mui/material";

class Category extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            clicked: this.props.selected,
        }
    }

    render() {
        const onCategoryClicked = () => {
            this.setState({clicked: !this.state.clicked});
            if (!this.state.clicked) this.props.onCategorySelected(); else this.props.onCategoryDeselected();
        }

        return (
            <Chip sx={{margin: '24px 4px'}} variant={this.state.clicked ? '' : 'outlined'} label={this.props.category} onClick={onCategoryClicked}/>
        )
    }
}

export default Category;
