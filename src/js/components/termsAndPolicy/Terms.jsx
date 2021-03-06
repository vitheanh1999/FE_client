import React, { Component } from 'react';
import './policy.css';
import './base.css';
import { PRODUCT_MODE } from '../../constants/ProductType';
import i18n from '../../i18n/i18n';
import images from '../../theme/images';
import Helmet from 'react-helmet';
import { Ul, Li } from './Policy';

class Terms extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() { }

  render() {
    let companyEmail = ''; // i18n.t('autoDbacLink');
    let companyName = 'fifties hacker';
    let corp = i18n.t('krais');

    return (

      <div id="TermAndPolicy">
        <Helmet>
          <title>Fifties Hacker</title>
          <link rel="icon" type="image/png" sizes="180x180" href={images.FEFavicon} />
          <meta name="title" content="Default Title" />
        </Helmet>
        <h1>利用規約</h1>
        <p>本利用規約（以下「本規約」と言います。）には、本サービスの提供条件及び当社と登録ユーザーの皆様との間の権利義務関係が定められています。本サービスの利用に際しては、本規約の全文をお読みいただいたうえで、本規約に同意いただく必要があります。</p>

        <Ul>
          <Li>
            <h2>第1条（適用）</h2>
            <Ul>
              <Li>1. 本規約は、本サービスの提供条件及び本サービスの利用に関する当社と登録ユーザーとの間の権利義務関係を定めることを目的とし、登録ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されます。</Li>
              <Li>2. 当社が当社ウェブサイト上で掲載する本サービス利用に関するルール{companyEmail === '' ? '' : `（https://${companyEmail}）`}は、本規約の一部を構成するものとします。</Li>
              <Li>3. 本規約の内容と、前項のルールその他の本規約外における本サービスの説明等とが異なる場合は、本規約の規定が優先して適用されるものとします。</Li>
              <Li></Li>
            </Ul>
          </Li>
          <Li>
            <h2>第2条（定義）</h2>
            <p>本規約において使用する以下の用語は、各々以下に定める意味を有するものとします。</p>
            <Ul>
              <Li>⑴ 「サービス利用契約」とは、本規約及び当社と登録ユーザーの間で締結する、本サービスの利用契約を意味します。</Li>
              <Li>⑵ 「知的財産権」とは、著作権、特許権、実用新案権、意匠権、商標権その他の知的財産権（それらの権利を取得し、又はそれらの権利につき登録等を出願する権利を含みます。）を意味します。</Li>
              <Li>(3) 「当社」とは、株式会社{corp}を意味します。</Li>
              <Li>(4) 「当社ウェブサイト」とは、そのドメインが「 https://fifties-hacker.com」である、当社が運営するウェブサイト（理由の如何を問わず、当社のウェブサイトのドメイン又は内容が変更された場合は、当該変更後のウェブサイトを含みます。）を意味します。</Li>
              <Li>(5) 「登録ユーザー」とは、第3条（登録）に基づいて本サービスの利用者としての登録がなされた個人又は法人を意味します。</Li>
              <Li>(6)「本サービス」とは、当社が提供する{companyName}という名称のサービス（理由の如何を問わずサービスの名称又は内容が変更された場合は、当該変更後のサービスを含みます。）を意味します。</Li>
            </Ul>
          </Li>
          <Li>
            <h2>第3条（登録）</h2>
            <Ul>
              <Li>1. 本サービスの利用を希望する者（以下「登録希望者」といいます。）は、本規約を遵守することに同意し、かつ当社の定める一定の情報（以下「登録事項」といいます。）を当社の定める方法で当社に提供することにより、当社に対し、本サービスの利用の登録を申請することができます。</Li>
              <Li>2. 当社は、当社の基準に従って、第１項に基づいて登録申請を行った登録希望者（以下「登録申請者」といいます。）の登録の可否を判断し、当社が登録を認める場合にはその旨を登録申請者に通知します。登録申請者の登録ユーザーとしての登録は、当社が本項の通知を行ったことをもって完了したものとします。</Li>
              <Li>3. 前項に定める登録の完了時に、サービス利用契約が登録ユーザーと当社の間に成立し、登録ユーザーは本サービスを本規約に従い利用することができるようになります。</Li>
              <Li>4. 当社は、登録申請者が、以下の各号のいずれかの事由に該当する場合は、登録及び再登録を拒否することがあり、またその理由について一切開示義務を負いません。</Li>
              <Ul>
                <Li>⑴ 当社に提供した登録事項の全部又は一部につき虚偽、誤記又は記載漏れがあった場合</Li>
                <Li>⑵ 未成年者、成年被後見人、被保佐人、被補助人その他法律上契約締結の能力に制限がある者であり、法定代理人等の同意を得ていなかった場合</Li>
                <Li>⑶ 反社会的勢力等（暴力団、暴力団員、右翼団体、反社会的勢力、その他これに準ずる者を意味します。以下同じ。）である、又は資金提供その他を通じて反社会的勢力等の維持、運営もしくは経営に協力もしくは関与する等反社会的勢力等との何らかの交流もしくは関与を行っていると当社が判断した場合</Li>
                <Li>⑷ 登録希望者が過去当社との契約に違反した者又はその関係者であると当社が判断した場合</Li>
                <Li>⑸ 第10条に定める措置を受けたことがある場合</Li>
                <Li>⑹ その他、当社が登録を適当でないと判断した場合</Li>
              </Ul>
            </Ul>
          </Li>
          <Li>
            <h2>第4条（登録事項の変更）</h2>
            <p>登録ユーザーは、登録事項に変更があった場合、当社の定める方法により当該変更事項を遅滞なく当社に通知するものとします。</p>
          </Li>
          <Li>
            <h2>第5条（パスワード及びユーザーIDの管理）</h2>
            <Ul>
              <Li>1. 登録ユーザーは、自己の責任において、本サービスに関するパスワード及びユーザーIDを適切に管理及び保管するものとし、これを第三者に利用させ、又は貸与、譲渡、名義変更、売買等をしてはならないものとします。</Li>
              <Li>2. パスワード又はユーザーIDの管理不十分、使用上の過誤、第三者の使用等によって生じた損害に関する責任は登録ユーザーが負うものとし、当社は一切の責任を負いません。</Li>
            </Ul>
          </Li>
          <Li>
            <h2>第6条（料金）</h2>
            <p>1.　本サービスの利用の対価は無料です。ただし、登録ユーザーは、自らの負担において本サービスの利用のために必要な設備・機械等を準備する必要があります。</p>
          </Li>
          <Li>
            <h2>第7条（禁止事項）</h2>
            <p>登録ユーザーは、本サービスの利用にあたり、以下の各号のいずれかに該当する行為又は該当すると当社が判断する行為をしてはなりません。</p>
            <Ul>
              <Li>⑴ 法令に違反する行為又は犯罪行為に関連する行為</Li>
              <Li>⑵ 当社、本サービスの他の利用者又はその他の第三者に対する詐欺又は脅迫行為</Li>
              <Li>⑶ 公序良俗に反する行為</Li>
              <Li>⑷ 当社、本サービスの他の利用者又はその他の第三者の知的財産権、肖像権、プライバシーの権利、名誉、その他の権利又は利益を侵害する行為</Li>
              <Li>(5) 本サービスのネットワーク又はシステム等に過度な負荷をかける行為</Li>
              <Li>(6) 本サービスの運営を妨害するおそれのある行為</Li>
              <Li>(7) 当社のネットワーク又はシステム等に不正にアクセスし、又は不正なアクセスを試みる行為</Li>
              <Li>(8) 第三者に成りすます行為</Li>
              <Li>(9) 本サービスの他の利用者のID又はパスワードを利用する行為</Li>
              <Li>(10) 当社が事前に許諾しない本サービス上での宣伝、広告、勧誘、又は営業行為</Li>
              <Li>(11) 本サービスの他の利用者の情報の収集</Li>
              <Li>(12) 当社、本サービスの他の利用者又はその他の第三者に不利益、損害、不快感を与える行為</Li>
              <Li>(13) 当社ウェブサイト上で掲載する本サービス利用に関するルールに抵触する行為</Li>
              <Li>(14) 反社会的勢力等への利益供与</Li>
              <Li>(15) 前各号の行為を直接又は間接に惹起し、又は容易にする行為</Li>
              <Li>(16) その他、当社が不適切と判断する行為</Li>
            </Ul>
          </Li>
          <Li>
            <h2>第8条（本サービスの停止等）</h2>
            <Ul>
              <Li>1. 当社は、以下のいずれかに該当する場合には、登録ユーザーに事前に通知することなく、本サービスの全部又は一部の提供を停止又は中断することができるものとします。
    	    	<Ul>
                  <Li>⑴ 本サービスに係るコンピューター・システムの点検又は保守作業を緊急に行う場合</Li>
                  <Li>⑴ 本サービスに係るコンピューター・システムの点検又は保守作業を緊急に行う場合</Li>
                  <Li>⑶ 地震、落雷、火災、風水害、停電、天災地変などの不可抗力により本サービスの運営ができなくなった場合</Li>
                  <Li>⑷ その他、当社が停止又は中断を必要と判断した場合</Li>
                </Ul>
              </Li>
              <Li>2. 当社は、本条に基づき当社が行った措置に基づき登録ユーザーに生じた損害について一切の責任を負いません。</Li>
            </Ul>
          </Li>
          <Li>
            <h2>第9条（権利帰属）</h2>
            <p>当社ウェブサイト及び本サービスに関する知的財産権は全て当社又は当社にライセンスを許諾している者に帰属しており、本規約に基づく本サービスの利用許諾は、当社ウェブサイト又は本サービスに関する当社又は当社にライセンスを許諾している者の知的財産権の使用許諾を意味するものではありません。</p>
          </Li>
          <Li>
            <h2>第10条（登録抹消等）</h2>
            <Ul>
              <Li>1. 当社は、登録ユーザーが、以下の各号のいずれかの事由に該当する場合は、事前に通知又は催告することなく、投稿データを削除しもしくは当該登録ユーザーについて本サービスの利用を一時的に停止し、又は登録ユーザーとしての登録を抹消、もしくはサービス利用契約を解除することができます。
    	    	<Ul>
                  <Li>⑴ 本規約のいずれかの条項に違反した場合</Li>
                  <Li>⑵ 登録事項に虚偽の事実があることが判明した場合</Li>
                  <Li>⑶ 支払停止もしくは支払不能となり、又は破産手続開始、民事再生手続開始、会社更生手続開始、特別清算開始若しくはこれらに類する手続の開始の申立てがあった場合</Li>
                  <Li>⑷ 12ヶ月以上本サービスの利用がない場合</Li>
                  <Li>⑸ 当社からの問いあわせその他の回答を求める連絡に対して、90日間以上応答がない場合</Li>
                  <Li>⑹ 第3条第4項各号に該当する場合</Li>
                  <Li>⑺ その他、当社が本サービスの利用、登録ユーザーとしての登録、又はサービス利用契約の継続を適当でないと判断した場合</Li>
                </Ul>
              </Li>
              <Li>2. 前項各号のいずれかの事由に該当した場合、登録ユーザーは、当社に対して負っている債務の一切について当然に期限の利益を失い、直ちに当社に対して全ての債務の支払を行わなければなりません。</Li>
              <Li>3. 当社は、本条に基づき当社が行った行為により登録ユーザーに生じた損害について一切の責任を負いません。</Li>
              <Li></Li>
            </Ul>
          </Li>
          <Li>
            <h2>第11条（退会）</h2>
            <Ul>
              <Li>1. 登録ユーザーは、当社所定の方法で当社に通知することにより、本サービスから退会し、自己の登録ユーザーとしての登録を抹消することができます。</Li>
              <Li>2. 退会にあたり、当社に対して負っている債務が有る場合は、登録ユーザーは、当社に対して負っている債務の一切について当然に期限の利益を失い、直ちに当社に対して全ての債務の支払を行わなければなりません。</Li>
              <Li>2. 退会にあたり、当社に対して負っている債務が有る場合は、登録ユーザーは、当社に対して負っている債務の一切について当然に期限の利益を失い、直ちに当社に対して全ての債務の支払を行わなければなりません。</Li>
              <Li></Li>
            </Ul>
          </Li>
          <Li>
            <h2>第12条（本サービスの内容の変更、終了）</h2>
            <Ul>
              <Li>1. 当社は、当社の都合により、本サービスの内容を変更し、又は提供を終了することができます。当社が本サービスの提供を終了する場合、当社は登録ユーザーに事前に通知するものとします。</Li>
              <Li>2. 当社は、本条に基づき当社が行った措置に基づき登録ユーザーに生じた損害について一切の責任を負いません。</Li>
            </Ul>
          </Li>
          <Li>
            <h2>第13条（保証の否認及び免責）</h2>
            <Ul>
              <Li>1. 当社は、本サービスが登録ユーザーの特定の目的に適合すること、期待する機能・商品的価値・正確性・有用性を有すること、登録ユーザーによる本サービスの利用が登録ユーザーに適用のある法令又は業界団体の内部規則等、その他第三者が定める利用規約等に適合すること、及び本サービスに不具合が生じないことについて、何ら保証するものではなく、登録ユーザーが被る不利益及び損害について一切責任を負いません。</Li>
              <Li>2. 当社は、当社による本サービスの提供の中断、停止、終了、利用不能又は変更、登録ユーザーが本サービスに送信したメッセージ又は情報の削除又は消失、登録ユーザーの登録の抹消、本サービスの利用による登録データの消失又は機器の故障もしくは損傷、その他本サービスに関して登録ユーザーが被った損害（以下「ユーザー損害」といいます。）につき、賠償する責任を一切負わないものとします。</Li>
              <Li>3. 何らかの理由により当社が責任を負う場合であっても、当社は、ユーザー損害につき、過去12ヶ月間に登録ユーザーが当社に支払った対価の金額を超えて賠償する責任を負わないものとし、また、付随的損害、間接損害、特別損害、将来の損害及び逸失利益にかかる損害については、賠償する責任を負わないものとします。</Li>
              <Li>4. 本サービス又は当社ウェブサイトに関連して登録ユーザーと他の登録ユーザー又は第三者との間において生じた取引、連絡、紛争等については、当社は一切責任を負いません。</Li>
            </Ul>
          </Li>
          <Li>
            <h2>第14条（秘密保持）</h2>
            <p>登録ユーザーは、本サービスに関連して当社が登録ユーザーに対して秘密に取り扱うことを求めて開示した非公知の情報について、当社の事前の書面による承諾がある場合を除き、秘密に取り扱うものとします。</p>
          </Li>
          <Li>
            <h2>第15条（利用者情報の取扱い）</h2>
            <Ul>
              <Li>1. 当社による登録ユーザーの利用者情報の取扱いについては、別途当社プライバシーポリシー（
                <a href={`${window.location.origin}/privacy`} target="_blank">{window.location.origin}/privacy</a>）の定めによるものとし、登録ユーザーはこのプライバシーポリシーに従って当社が登録ユーザーの利用者情報を取扱うことについて同意するものとします。</Li>
              <Li>2. 当社は、登録ユーザーが当社に提供した情報、データ等を、個人を特定できない形での統計的な情報として、当社の裁量で、利用及び公開することができるものとし、ユーザーはこれに異議を唱えないものとします。</Li>
            </Ul>
          </Li>
          <Li>
            <h2>第16条（本規約等の変更）</h2>
            <p>当社は、本規約を変更できるものとします。当社は、本規約を変更した場合には、登録ユーザーに当該変更内容を通知するものとし、当該変更内容の通知後、登録ユーザーが本サービスを利用した場合又は当社の定める期間内に登録抹消の手続をとらなかった場合には、登録ユーザーは、本規約の変更に同意したものとみなします。</p>
          </Li>
          <Li>
            <h2>第17条（連絡／通知）</h2>
            <p>本サービスに関する問い合わせその他登録ユーザーから当社に対する連絡又は通知、及び本規約の変更に関する通知その他当社から登録ユーザーに対する連絡又は通知は、当社の定める方法で行うものとします。</p>
          </Li>
          <Li>
            <h2>第18条（サービス利用契約上の地位の譲渡等）</h2>
            <Ul>
              <Li>1. 登録ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位又は本規約に基づく権利もしくは義務につき、第三者に対し、譲渡、移転、担保設定、その他の処分をすることはできません。</Li>
              <Li>2. 当社は本サービスにかかる事業を他者に譲渡した場合には、当該事業譲渡に伴い利用契約上の地位、本規約に基づく権利及び義務並びに登録ユーザーの登録事項その他の顧客情報を当該事業譲渡の譲受人に譲渡することができるものとし、登録ユーザーは、かかる譲渡につき本項において予め同意するものとします。なお、本項に定める事業譲渡には、通常の事業譲渡のみならず、会社分割その他事業が移転するあらゆる場合を含むものとします。</Li>
            </Ul>
          </Li>
          <Li>
            <h2>第19条（分離可能性）</h2>
            <p>本規約のいずれかの条項又はその一部が、消費者契約法その他の法令等により無効又は執行不能と判断された場合であっても、本規約の残りの規定及び一部が無効又は執行不能と判断された規定の残りの部分は、継続して完全に効力を有するものとします。</p>
          </Li>
          <Li>
            <h2>第20条（準拠法及び管轄裁判所）</h2>
            <Ul>
              <Li>1. 本規約及びサービス利用契約の準拠法は日本法とします。</Li>
              <Li>2. 本規約又はサービス利用契約に起因し、又は関連する一切の紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</Li>
            </Ul>
          </Li>
        </Ul>

        <p className="date">【2020年3月22日制定】</p>

      </div>
    );
  }
}

Terms.defaultProps = {
};

Terms.propTypes = {
};

export default Terms;
