import * as express from 'express';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticContext, StaticRouterContext } from 'react-router';
import { Route, StaticRouter } from 'react-router-dom';

interface RouteStatusProps {
    statusCode: number;
}

const RouteStatus: React.FunctionComponent<RouteStatusProps> = props => (
    <Route
        render={({ staticContext }: { staticContext?: StaticContext }) => {
            if (staticContext) {
                staticContext.statusCode = props.statusCode;
            }

            return <div>{props.children}</div>;
        }}
    />
);

interface PrintContextProps {
    staticContext: StaticContext;
}

const PrintContext: React.FunctionComponent<PrintContextProps> = props => (
    <p>Static context: {JSON.stringify(props.staticContext)}</p>
);

class StaticRouterExample extends React.Component {
    staticContext: StaticRouterContext = {};

    render() {
        return (
            <StaticRouter location="/foo" context={this.staticContext}>
                <div>
                    <RouteStatus statusCode={404}>
                        <p>Route with statusCode 404</p>
                        <PrintContext staticContext={this.staticContext} />
                    </RouteStatus>
                </div>
            </StaticRouter>
        );
    }
}

const app = express();

app.get('*', (req, res) => {
    const staticContext: StaticRouterContext = {};

    const html = renderToString(
        <StaticRouter location={req.url} context={staticContext}>
            (includes the RouteStatus component below e.g. for 404 errors)
        </StaticRouter>,
    );

    res.status(staticContext.statusCode || 200).send(html);
});

export default StaticRouterExample;
