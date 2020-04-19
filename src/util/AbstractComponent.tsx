import React from 'react';

export abstract class AbstractComponent<Props extends object> extends React.PureComponent<Props, {}, any> {

    abstract name: string;

    /**
     * Load data for the component after render.
     */
    abstract loadData?: () => Promise<void>;

    /**
     * Dispose component after unmount.
     */
    async dispose(): Promise<void> { };

    loading = false;

    /**
     * Render this component.
     */
    abstract renderComponent(): any;

    protected autoKeys(result: any): any {
        if (Array.isArray(result)) {
            return result.map((x, i) => {
                if (x?.props != null) {
                    const key = { ...x.props }['key'] as string | undefined;
                    if (key == null) {
                        return (
                            <React.Fragment key={`__${i}`}>
                                {x}
                            </React.Fragment>
                        );
                    } else if(key.startsWith('__')) {
                        return (
                            <React.Fragment key={`${key}__${i}`}>
                                {x}
                            </React.Fragment>
                        );
                    }
                }
                return x;
            });
        }
        return result;
    }

    private renderComponentInternal(): any {
        return this.autoKeys(this.renderComponent());
    }

    error = '';

    throwError(err: any) {
        this.loading = false;
        console.log(err);
        let error: Error = err;
        this.error = error.message || err?.errors?.[0]?.message || err?.toString() || String(err);
        this.forceUpdate();
    }

    renderError() {
        return [
            <div className="ErrorMessage">
                <p>Hovsa.Der er sket en fejl.</p>
                <p> {this.error} </p>
            </div>,
            this.renderComponentInternal()
        ];
    }

    renderLoading() {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-grow text-success" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    renderContent() {
        if (this.error !== '')
            return this.renderError();

        if (this.loading)
            return this.renderLoading();

        return this.renderComponentInternal();
    }

    render() {
        return (
            <div className={this.name}>
                {this.renderContent()}
            </div>
        );
    }

    mounted = false;

    componentDidMount() {
        this.mounted = true;
        if (this.loadData == null)
            return;

        this.loading = true;
        this.forceUpdate();
        this.loadData()
            .then(() => {
                this.loading = false;
                if(this.mounted)
                    this.forceUpdate();
            })
            .catch(err => {
                if(this.mounted)
                    this.throwError(err);
            });
    }

    componentWillUnmount() {
        this.mounted = false;
        this.dispose();
    }
}
