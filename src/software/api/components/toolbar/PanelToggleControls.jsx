import React, { useRef } from 'react';
import { debounce, editorModeKey, localStorageUtils, toggleButtonStatesJsOnlyKey, toggleButtonStatesKey } from '../../utils';

export default function PanelToggleControls({ appState }) {
    const notebookBtn = useRef();
    const jsOnlyBtn = useRef();
    const jsBtn = useRef();
    const cssBtn = useRef();
    const htmlBtn = useRef();
    const consoleBtn = useRef();
    const outputBtn = useRef();

    onClick = debounce(onClick, 250);
    onJsOnlyClick = debounce(onJsOnlyClick, 250);
    onNotebookOnlyClick = debounce(onNotebookOnlyClick, 250);
    return (
        <>
            <div className="btn-group my-2 mr-sm-2" id="toggle">
                <button
                    type="button"
                    id="toggle-notebook-only"
                    onClick={onNotebookOnlyClick}
                    data-toggle="button"
                    aria-pressed="false"
                    className={"btn" + (appState.notebookOnly ? ' active' : '')}
                    ref={notebookBtn}
                >
                    Notebook
                </button>
                <button
                    type="button"
                    id="toggle-js-only"
                    onClick={onJsOnlyClick}
                    data-toggle="button"
                    aria-pressed="false"
                    className={"btn" + (appState.jsOnly ? ' active' : '')}
                    ref={jsOnlyBtn}
                >
                    JS Only
                </button>
                <button
                    type="button"
                    id="toggle-js"
                    onClick={onClick}
                    data-toggle="button"
                    aria-pressed="false"
                    className={"btn" + (appState.paneToggleButtonStates.js ? ' active' : '')}
                    ref={jsBtn}
                >
                    {appState.jsOnly ? 'JS 1' : 'JS'}
                </button>
                <button
                    type="button"
                    id="toggle-css"
                    onClick={onClick}
                    data-toggle="button"
                    aria-pressed="false"
                    className={"btn" + (appState.paneToggleButtonStates.css ? ' active' : '')}
                    ref={cssBtn}
                >
                    {appState.jsOnly ? 'JS 2' : 'CSS'}
                </button>
                <button
                    type="button"
                    id="toggle-html"
                    onClick={onClick}
                    data-toggle="button"
                    aria-pressed="false"
                    className={"btn" + (appState.paneToggleButtonStates.html ? ' active' : '')}
                    ref={htmlBtn}
                >
                    {appState.jsOnly ? 'JS 3' : 'HTML'}
                </button>
                <button
                    type="button"
                    id="toggle-console"
                    onClick={onClick}
                    data-toggle="button"
                    aria-pressed="false"
                    className={"btn" + (appState.paneToggleButtonStates.console ? ' active' : '')}
                    ref={consoleBtn}
                >Console
                </button>
                <button
                    type="button"
                    id="toggle-output"
                    onClick={onClick}
                    data-toggle="button"
                    aria-pressed="false"
                    className={"btn" + (appState.paneToggleButtonStates.output ? ' active' : '')}
                    ref={outputBtn}
                >Output
                </button>
            </div>
        </>
    );

    function saveToggleState(toggleState) {
        const jsMode = appState.jsOnlyRef.current;
        toggleState = toggleState || appState.paneToggleButtonStates;
        const toggleStateKey = jsMode ? toggleButtonStatesJsOnlyKey : toggleButtonStatesKey;
        localStorageUtils.setObject(toggleStateKey, toggleState || {});
    }

    function onJsOnlyClick(e) {
        e.preventDefault();
        appState.jsOnlyRef.current = !appState.jsOnlyRef.current;
        appState.setJsOnly(appState.jsOnlyRef.current);
        toggleNoteBookOrJsOnly(appState.jsOnlyRef.current ? "js-only" : "normal");
    }

    function onNotebookOnlyClick(e) {
        e.preventDefault();
        appState.notebookOnlyRef.current = !appState.notebookOnlyRef.current;
        appState.setNotebookOnly(appState.notebookOnlyRef.current);
        toggleNoteBookOrJsOnly(appState.notebookOnlyRef.current ? "notebook-only" : "normal");
    }

    function onClick(e) {
        e.preventDefault();
        const btn = e.target;
        setToggleStatesHelper(btn);
    }

    function toggleNoteBookOrJsOnly(activeAppState) {
        localStorage.setItem(editorModeKey, activeAppState);
        const { css, html } = appState.editorRef.current;
        if (!css?.setMode || !html?.setMode || !jsBtn.current)
            return;

        if (activeAppState !== "normal") {
            css.setMode('javascript');
            html.setMode('javascript');
            appState.urlState.restoreState(activeAppState);
        } else {
            css.setMode('css');
            html.setMode('html');
            appState.urlState.restoreState('normal');
        }
    }

    function setToggleStatesHelper(btn) {
        let id = btn.id.replace('toggle-', '');
        id = id === 'js-only' ? 'jsOnly' : "notebook-only" ? "notebookOnly" : id;
        const newStateObj = { ...appState.paneToggleButtonStates };
        newStateObj.notebookOnly = appState.notebookOnlyRef.current;
        newStateObj.jsOnly = appState.jsOnlyRef.current;
        newStateObj[id] = !appState.paneToggleButtonStates[id];
        appState.setPaneToggleButtonStates(newStateObj);
        saveToggleState(newStateObj);
        return newStateObj[id];
    }
}
