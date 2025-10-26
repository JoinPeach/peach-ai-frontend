function DivCss15Nffxn() {
  return (
    <div className="relative shrink-0 w-full" data-name="div.css-15nffxn">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-[4px] items-center pl-0 pr-[284px] py-0 relative w-full">
          <div className="bg-[#ffa88b] h-[8px] rounded-[7992px] shrink-0 w-[70px]" data-name="div.css-wlt9ab" />
          <div className="bg-[#ffa88b] h-[8px] rounded-[7992px] shrink-0 w-[70px]" data-name="div.css-wlt9ab" />
          <div className="bg-[#f2f1f4] h-[8px] rounded-[7992px] shrink-0 w-[70px]" data-name="div.css-1b0fq1t" />
          <div className="bg-[#f2f1f4] h-[8px] rounded-[7992px] shrink-0 w-[70px]" data-name="div.css-1b0fq1t" />
        </div>
      </div>
    </div>
  );
}

function Left() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[18px] grow items-start leading-[0] min-h-px min-w-px relative shrink-0" data-name="left">
      <div className="font-['SF_Pro:Medium',_sans-serif] font-[510] relative shrink-0 text-[#0b0b0b] text-[24px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px]">Generate with Peach AI Assistant</p>
      </div>
      <div className="-webkit-box css-2vsutx font-['SF_Pro:Regular',_sans-serif] font-normal overflow-ellipsis overflow-hidden relative shrink-0 text-[#212121] text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Enter your campaign’s main topic or keywords below and you’ll get instant custom replies and suggestions. You can use the response as they are, or change the wording to better fit your campaign. Lorem ipsum dolor sit amet consectetur. Vestibulum libero sed eget elementum odio euismod leo diam. Sed urna montes non habitant risus amet tellus.</p>
      </div>
    </div>
  );
}

function Wrapper() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[506px]" data-name="wrapper">
      <Left />
    </div>
  );
}

function MasterGeneral() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0" data-name="master/ general">
      <Wrapper />
    </div>
  );
}

function TitleSectionTitle() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="title section: title">
      <MasterGeneral />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="font-['SF_Pro:Semibold',_sans-serif] font-[590] leading-[0] max-w-[576px] relative shrink-0 text-[#212121] text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">What is your campaign about? (ex. lorem ipsum dolor)</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[100px] relative rounded-[12px] shrink-0 w-full" data-name="Input">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex h-[100px] items-start p-[16px] w-full" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#7f7f7f] border-solid inset-[-1px] pointer-events-none rounded-[13px]" />
    </div>
  );
}

function Frame1000004319() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Label />
      <Input />
    </div>
  );
}

function MasterOutlineButton() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[12px] relative rounded-[8px] shrink-0" data-name="master/ outline button">
      <div aria-hidden="true" className="absolute border border-[#cecece] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['Inter:Semi_Bold',_sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#6d6d6d] text-[14px] text-nowrap">
        <p className="leading-[20px] whitespace-pre">Cancel</p>
      </div>
    </div>
  );
}

function ButtonRoundedOutline() {
  return (
    <button className="box-border content-stretch cursor-pointer flex items-start overflow-visible p-0 relative shrink-0" data-name="button: rounded/ outline">
      <MasterOutlineButton />
    </button>
  );
}

function MasterButton() {
  return (
    <div className="bg-[rgba(46,44,52,0.2)] box-border content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[12px] relative rounded-[8px] shrink-0" data-name="master/ button">
      <div className="flex flex-col font-['Inter:Semi_Bold',_sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
        <p className="leading-[20px] whitespace-pre">Continue</p>
      </div>
    </div>
  );
}

function ButtonRoundedFilled() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="button: rounded/ filled">
      <MasterButton />
    </div>
  );
}

function Buttons() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="buttons">
      <ButtonRoundedOutline />
      <ButtonRoundedFilled />
    </div>
  );
}

export default function AiEmailGeneratorModal2() {
  return (
    <div className="bg-white relative rounded-[16px] shadow-[0px_4px_50px_0px_rgba(33,33,33,0.08),0px_4px_6px_0px_rgba(33,33,33,0.04)] size-full" data-name="ai email generator modal 2">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start p-[24px] relative size-full">
          <DivCss15Nffxn />
          <TitleSectionTitle />
          <Frame1000004319 />
          <Buttons />
        </div>
      </div>
    </div>
  );
}