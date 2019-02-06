import React from "react";
import { Button, Glyphicon } from "react-bootstrap";

const LoaderButton = ({isLoading, text, loadingText, className = "", disabled = false, type}) =>(
        <Button
            type={type}
            className={`LoaderButton ${className}`}
            disabled={disabled || isLoading}>
            {isLoading && <Glyphicon glyph="refresh" className="spinning" />}
            {!isLoading ? text : loadingText}
        </Button>
);
export default LoaderButton;