export default interface IState<T> {
    onEnter(from?: T, event?: any);
    on(from?: T, event?: any);
    onExit(from?: T, event?: any);
    call(): void;
}