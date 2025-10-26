function Left() {
  return (
    <div className="h-[58px] leading-[0] relative shrink-0 text-nowrap w-[310px]" data-name="left">
      <div className="absolute font-['SF_Pro:Medium',_sans-serif] font-[510] left-0 text-[#0b0b0b] text-[24px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] text-nowrap whitespace-pre">{`Subject `}</p>
      </div>
      <div className="absolute font-['SF_Pro:Regular',_sans-serif] font-normal left-0 overflow-ellipsis overflow-hidden text-[#6d6d6d] text-[16px] top-[38px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] overflow-ellipsis overflow-hidden text-nowrap whitespace-pre">Add a subject line for this campaign</p>
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

function Label() {
  return (
    <div className="relative shrink-0 w-full" data-name="Label">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col items-start pb-[0.2px] pl-0 pr-[467.9px] pt-0 relative w-full">
          <div className="flex flex-col font-['SF_Pro:Regular',_sans-serif] font-normal justify-center leading-[0] max-w-[576px] relative shrink-0 text-[#212121] text-[13.453px] text-nowrap tracking-[-0.1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[22.4px] whitespace-pre">Subject line</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Div() {
  return (
    <div className="content-stretch flex items-center justify-end overflow-clip relative shrink-0 w-[385px]" data-name="div">
      <div className="flex flex-col font-['SF_Pro:Regular',_sans-serif] font-normal justify-center leading-[0] max-w-[544px] relative shrink-0 text-[#6c6685] text-[13.234px] text-nowrap text-right tracking-[-0.1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">11/140</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[50px] relative rounded-[12px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex h-[50px] items-center px-[16px] py-[9px] relative w-full">
          <div className="flex flex-col font-['SF_Pro:Regular',_sans-serif] font-normal justify-center leading-[0] max-w-[544px] relative shrink-0 text-[#212121] text-[15px] text-nowrap text-right tracking-[-0.1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal] whitespace-pre">FAFSA Error</p>
          </div>
          <Div />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#7f7f7f] border-solid inset-[-1px] pointer-events-none rounded-[13px]" />
    </div>
  );
}

function DivCss7Zhfhb() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[3.99px] items-start pb-[0.01px] pt-0 px-0 relative shrink-0 w-full" data-name="div.css-7zhfhb">
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
    <div className="bg-[#2e2c34] box-border content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[12px] relative rounded-[8px] shrink-0" data-name="master/ button">
      <div className="flex flex-col font-['Inter:Semi_Bold',_sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
        <p className="leading-[20px] whitespace-pre">Save</p>
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
    <div className="content-stretch flex gap-[16px] items-start justify-end relative shrink-0 w-full" data-name="buttons">
      <ButtonRoundedOutline />
      <ButtonRoundedFilled />
    </div>
  );
}

export default function AddSubjectLineModal2() {
  return (
    <div className="bg-white relative rounded-[16px] shadow-[0px_4px_50px_0px_rgba(33,33,33,0.08),0px_4px_6px_0px_rgba(33,33,33,0.04)] size-full" data-name="add subject line modal 2">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start p-[24px] relative size-full">
          <TitleSectionTitle />
          <DivCss7Zhfhb />
          <Buttons />
        </div>
      </div>
    </div>
  );
}