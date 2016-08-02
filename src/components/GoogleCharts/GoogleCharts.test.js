import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {GoogleCharts} from './GoogleCharts.jsx'

describe('Components', () => {
	describe('GoogleCharts.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(GoogleCharts, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});
