// export function returnObserver() {
// 	return {
// 		subscribe(){}
// 	};
// }
export function returnObserverWithCallback(obj, shouldJson) {
	if (shouldJson) {
		return {
			subscribe(callback){
				callback({json(){ return obj; }});
			}
		};
	}
	return {
		subscribe(callback){
			callback(obj);
		}
	};
}
