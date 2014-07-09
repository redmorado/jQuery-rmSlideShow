# jquery.rmslideshow.js

スライドショーのjQueryライブラリ

	$ bower install

## 使い方

	$.(親要素のセレクタ).rmslideshow(オプション);

### オプション

**必須*

<table>
	<tr>
		<th>Property</th>
		<th>Value</th>
		<th>Default value</th>
		<th>Description</th>
	</tr>
	<tr><td>* width</td><td>(Number)</td><td>`930`</td><td>スライドするコンテンツの幅</td></tr>
	<tr><td>* height</td><td>(Number)</td><td>`300`</td><td>スライドするコンテンツの高さ</td></tr>
	<tr><td>target</td><td>(jQuery) jQuery DOM</td><td>`$this.children()`</td><td>スライドする要素<br>※data_typeがhtmlの場合のみ有効</td></tr>
	<tr><td>currentTargetClass</td><td>(String)</td><td>`'current'`</td><td>現在表示されているtargetに追加されるクラス名</td></tr>
	<tr><td>data_type</td><td>(String) `'html'`, `'xml'` or `'array'`</td><td>`'html'`</td><td>画像の配列データ</td></tr>
	<tr><td>data_source</td><td>(String) 'xml'<br>(Array) 'array'<br>format: `[{src:'img.path', url:'linkURL', target:'_blank', alt:'altString'}, …]`</td><td>`''`</td><td>ソースURLもしくは配列<br>※data_typeがhtml以外の場合のみ有効</td></tr>
	<tr><td>animation_type</td><td>(String) `'fade'`, `'slide'` or `'over-slide'`</td><td>`'fade'`</td><td>アニメーションタイプ</td></tr>
	<tr><td>animation_duration</td><td>(Number)</td><td>`500`</td><td>アニメーション持続時間ms</td></tr>
	<tr><td>animation_delay</td><td>(Number)</td><td>`10000`</td><td>スライド間隔ms<br>0以下で自動スライドしない</td></tr>
	<tr><td>enable_flick</td><td>(Boolean)</td><td>`true`</td><td>フリック遷移</td></tr>
	<tr><td>navigator</td><td>(Object) jQuery Selectors<br>format: `{left:'Selector', right:'Selector'}`</td><td>`null`</td><td>次/前リンクのjQueryセレクタ</td></tr>
	<tr><td>indicator</td><td>(String) jQuery Selector</td><td>`''`</td><td>インジケータのjQueryセレクタ</td></tr>
	<tr><td>indicatorInterface</td><td>(String) jQuery Selector</td><td>`''`</td><td>現在地を示すclass等の操作がされる要素をセレクタで指定</td></tr>
	<tr><td>progressCallback</td><td>(Function) `function(index, current, max){...};`</td><td>`null`</td><td>画像切り替え待機中に呼ばれる関数</td></tr>
	<tr><td>changedCallback</td><td>(Function) `function(toIndex, prevIndex){...};`</td><td>`null`</td><td>画像切り替え時に呼ばれる関数</td></tr>
	<tr><td>animatedCallback</td><td>(Function) `function(index){...};`</td><td>`null`</td><td>切り替えアニメーション終了後に呼ばれる関数</td></tr>
</table>


## リセット

スライドショーを停止して要素を元の状態に出来る限り近づける

	$.(親要素のセレクタ).data('plugin_rmslideshow').reset();