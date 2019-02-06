import React from 'react';


class SuccessMessage extends React.Component{
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    //This render is begin called even before props getting updated
    render() {
        if( this.props.userId != null ){
            return (
                <div className="container  alert alert-success" role="alert">
                    <h4 className="alert-heading">Well done!</h4>
                    <p>Aww yeah, you successfully read this important alert message. This example text is going to run a bit
                        longer so that you can see how spacing within an alert works with this kind of content.</p>
                    <hr/>
                    <p className="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and
                        tidy.</p>
                </div>
            );
        }else{
            return '';
        }

    }
}
export default SuccessMessage;