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
	<tr><td>* width</td><td>(Number)</td><td><code>930</code></td><td>スライドするコンテンツの幅</td></tr>
	<tr><td>* height</td><td>(Number)</td><td><code>300</code></td><td>スライドするコンテンツの高さ</td></tr>
	<tr><td>target</td><td>(jQuery) jQuery DOM</td><td><code>$this.children()</code></td><td>スライドする要素<br>※data_typeがhtmlの場合のみ有効</td></tr>
	<tr><td>currentTargetClass</td><td>(String)</td><td><code>'current'</code></td><td>現在表示されているtargetに追加されるクラス名</td></tr>
	<tr><td>data_type</td><td>(String) <code>'html'</code>, <code>'xml'</code> or <code>'array'</code></td><td><code>'html'</code></td><td>画像の配列データ</td></tr>
	<tr><td>data_source</td><td>(String) 'xml'<br>(Array) 'array'<br>format: <code>[{src:'img.path', url:'linkURL', target:'_blank', alt:'altString'}, …]</code></td><td><code>''</code></td><td>ソースURLもしくは配列<br>※data_typeがhtml以外の場合のみ有効</td></tr>
	<tr><td>animation_type</td><td>(String) <code>'fade'</code>, <code>'slide'</code> or <code>'over-slide'</code></td><td><code>'fade'</code></td><td>アニメーションタイプ</td></tr>
	<tr><td>animation_duration</td><td>(Number)</td><td><code>500</code></td><td>アニメーション持続時間ms</td></tr>
	<tr><td>animation_delay</td><td>(Number)</td><td><code>10000</code></td><td>スライド間隔ms<br>0以下で自動スライドしない</td></tr>
	<tr><td>enable_flick</td><td>(Boolean)</td><td><code>true</code></td><td>フリック遷移</td></tr>
	<tr><td>navigator</td><td>(Object) jQuery Selectors<br>format: <code>{left:'Selector', right:'Selector'}</code></td><td><code>null</code></td><td>次/前リンクのjQueryセレクタ</td></tr>
	<tr><td>indicator</td><td>(String) jQuery Selector</td><td><code>''</code></td><td>インジケータのjQueryセレクタ</td></tr>
	<tr><td>indicatorInterface</td><td>(String) jQuery Selector</td><td><code>''</code></td><td>現在地を示すclass等の操作がされる要素をセレクタで指定</td></tr>
	<tr><td>progressCallback</td><td>(Function) <code>function(index, current, max){...};</code></td><td><code>null</code></td><td>画像切り替え待機中に呼ばれる関数</td></tr>
	<tr><td>changedCallback</td><td>(Function) <code>function(toIndex, prevIndex){...};</code></td><td><code>null</code></td><td>画像切り替え時に呼ばれる関数</td></tr>
	<tr><td>animatedCallback</td><td>(Function) <code>function(index){...};</code></td><td><code>null</code></td><td>切り替えアニメーション終了後に呼ばれる関数</td></tr>
</table>


## リセット

スライドショーを停止して要素を元の状態に出来る限り近づける

	$.(親要素のセレクタ).data('plugin_rmslideshow').reset();