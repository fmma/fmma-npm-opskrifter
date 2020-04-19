import { RouteChildrenProps } from "react-router-dom";
import { AbstractComponent } from "./AbstractComponent";

export abstract class AbstractRouteComponent<Props extends object> extends AbstractComponent<RouteChildrenProps<Props>> {
    routeProps(): Partial<Props> {
        return this.props.match?.params ?? {};
    }
}
