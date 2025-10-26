function DivCss15Nffxn() {
  return (
    <div className="relative shrink-0 w-full" data-name="div.css-15nffxn">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-[4px] items-center pl-0 pr-[284px] py-0 relative w-full">
          <div className="bg-[#ffa88b] h-[8px] rounded-[7992px] shrink-0 w-[70px]" data-name="div.css-wlt9ab" />
          <div className="bg-[#f2f1f4] h-[8px] rounded-[7992px] shrink-0 w-[70px]" data-name="div.css-wlt9ab" />
          <div className="bg-[#f2f1f4] h-[8px] rounded-[7992px] shrink-0 w-[70px]" data-name="div.css-1b0fq1t" />
          <div className="bg-[#f2f1f4] h-[8px] rounded-[7992px] shrink-0 w-[70px]" data-name="div.css-1b0fq1t" />
        </div>
      </div>
    </div>
  );
}

function Left() {
  return (
    <div className="h-[78px] leading-[0] relative shrink-0 w-[506px]" data-name="left">
      <div className="absolute font-['SF_Pro:Medium',_sans-serif] font-[510] left-0 text-[#0b0b0b] text-[24px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] whitespace-pre">Generate with Peach AI Assistant</p>
      </div>
      <div className="-webkit-box absolute css-whubgi font-['SF_Pro:Regular',_sans-serif] font-normal h-[40px] left-0 overflow-ellipsis overflow-hidden text-[#6d6d6d] text-[16px] top-[38px] w-[506px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px]">Use AI-generated Lorem ipsum dolor sit amet consectetur. Amet vulputate non quis commodo purus tellus.</p>
      </div>
    </div>
  );
}

function Wrapper() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="wrapper">
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
    <div className="bg-[#2e2c34] box-border content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[12px] relative rounded-[8px] shrink-0" data-name="master/ button">
      <div className="flex flex-col font-['Inter:Semi_Bold',_sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
        <p className="leading-[20px] whitespace-pre">Let’s begin</p>
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

export default function AiEmailGeneratorModal1() {
  return (
    <div className="bg-white relative rounded-[16px] shadow-[0px_4px_50px_0px_rgba(33,33,33,0.08),0px_4px_6px_0px_rgba(33,33,33,0.04)] size-full" data-name="ai email generator modal 1">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start p-[24px] relative size-full">
          <DivCss15Nffxn />
          <TitleSectionTitle />
          <Buttons />
        </div>
      </div>
    </div>
  );
}